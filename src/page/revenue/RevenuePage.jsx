import React, { useState } from 'react';
import { Search, Calendar, ArrowUpDown, CheckCircle, Filter } from 'lucide-react';
import '../../styles/revenue/RevenueDashboard.css';

export default function RevenueDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('stt');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const payments = [
        { id: 1, landlordName: 'Nguyễn Văn A', amount: 500000, date: '2025-05-15', duration: '1 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 2, landlordName: 'Trần Thị B', amount: 1500000, date: '2025-05-12', duration: '3 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 3, landlordName: 'Trương Văn F', amount: 500000, date: '2025-06-15', duration: '1 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 4, landlordName: 'Phạm Thị D', amount: 2000000, date: '2025-05-05', duration: '6 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 6, landlordName: 'Nguyễn Thị A', amount: 1000000, date: '2025-04-28', duration: '3 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 7, landlordName: 'Võ Thị G', amount: 500000, date: '2025-04-20', duration: '1 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 8, landlordName: 'Mai Văn H', amount: 1500000, date: '2025-04-15', duration: '3 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 9, landlordName: 'Lý Thị I', amount: 500000, date: '2025-04-10', duration: '1 tháng', method: 'Chuyển khoản ngân hàng' },
        { id: 10, landlordName: 'Đặng Văn K', amount: 2000000, date: '2025-04-05', duration: '6 tháng', method: 'Chuyển khoản ngân hàng' },
    ];

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = payments.length;

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.landlordName.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDateRange = true;
        if (startDate && endDate) {
            const paymentDate = new Date(payment.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);
            matchesDateRange = paymentDate >= filterStartDate && paymentDate <= filterEndDate;
        } else if (startDate) {
            const paymentDate = new Date(payment.date);
            const filterStartDate = new Date(startDate);
            matchesDateRange = paymentDate >= filterStartDate;
        } else if (endDate) {
            const paymentDate = new Date(payment.date);
            const filterEndDate = new Date(endDate);
            matchesDateRange = paymentDate <= filterEndDate;
        }

        return matchesSearch && matchesDateRange;
    });

    const filteredRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const filteredPaymentsCount = filteredPayments.length;

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (sortBy === 'date') {
            return sortOrder === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortBy === 'name') {
            const getLastName = (fullName) => {
                const nameParts = fullName.trim().split(' ');
                return nameParts[nameParts.length - 1];
            };

            const lastNameA = getLastName(a.landlordName);
            const lastNameB = getLastName(b.landlordName);

            return sortOrder === 'asc'
                ? lastNameA.localeCompare(lastNameB, 'vi', { sensitivity: 'base' })
                : lastNameB.localeCompare(lastNameA, 'vi', { sensitivity: 'base' });
        } else if (sortBy === 'stt') {
            return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        }
        return 0;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="header">
                <h1 className="header-title">Quản Lý Doanh Thu</h1>
                <p className="header-subtitle">Theo dõi các khoản thanh toán từ chủ trọ</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Tổng doanh thu</p>
                    <p className="stat-value revenue">
                        {totalRevenue.toLocaleString('vi-VN')} đ
                    </p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">Số lượng thanh toán</p>
                    <p className="stat-value payments">{totalPayments}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="controls-container">
                <div className="controls-left">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm theo tên chủ trọ..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={18} />
                    </div>

                    <button
                        className="filter-button"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} />
                        <span>Lọc</span>
                    </button>
                </div>
            </div>

            {/* Filter dropdown */}
            {isFilterOpen && (
                <div className="filter-dropdown">
                    <h3 className="filter-title">Lọc theo khoảng thời gian</h3>
                    <div className="date-filters">
                        <div className="date-input-group">
                            <span className="date-label">Từ ngày:</span>
                            <div className="date-input-container">
                                <input
                                    type="date"
                                    className="date-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <Calendar className="date-icon" size={18} />
                            </div>
                        </div>

                        <div className="date-input-group">
                            <span className="date-label">Đến ngày:</span>
                            <div className="date-input-container">
                                <input
                                    type="date"
                                    className="date-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <Calendar className="date-icon" size={18} />
                            </div>
                        </div>
                    </div>

                    {(startDate || endDate) && (
                        <div className="filtered-stats">
                            <div className="filtered-stats-container">
                                <div>
                                    <h4 className="filtered-stats-title">Thông tin thống kê (thời gian đã lọc)</h4>
                                    <div className="filtered-stats-grid">
                                        <div>
                                            <p className="filtered-stat-label">Tổng doanh thu:</p>
                                            <p className="filtered-stat-value revenue">{filteredRevenue.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label">Số thanh toán:</p>
                                            <p className="filtered-stat-value payments">{filteredPaymentsCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead className="table-header">
                        <tr>
                            <th
                                className="table-header-cell sortable"
                                onClick={() => handleSort('stt')}
                            >
                                <div className="header-content">
                                    <span>STT</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="table-header-cell sortable"
                                onClick={() => handleSort('name')}
                            >
                                <div className="header-content">
                                    <span>Chủ trọ</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="table-header-cell sortable"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="header-content">
                                    <span>Số tiền</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th className="table-header-cell">
                                Thời hạn
                            </th>
                            <th
                                className="table-header-cell sortable"
                                onClick={() => handleSort('date')}
                            >
                                <div className="header-content">
                                    <span>Ngày thanh toán</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th className="table-header-cell">
                                Phương thức
                            </th>
                            <th className="table-header-cell">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedPayments.map((payment, index) => (
                            <tr key={payment.id} className="table-row">
                                <td className="table-cell">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="table-cell">
                                    <div className="landlord-name">{payment.landlordName}</div>
                                </td>
                                <td className="table-cell">
                                    <div className="amount">
                                        {payment.amount.toLocaleString('vi-VN')} đ
                                    </div>
                                </td>
                                <td className="table-cell">
                                    {payment.duration}
                                </td>
                                <td className="table-cell">
                                    {new Date(payment.date).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="table-cell">
                                    {payment.method}
                                </td>
                                <td className="table-cell">
                                    <span className="status-badge success">
                                        <CheckCircle size={16} className="status-icon" /> Thành công
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container">
                    <div className="pagination-mobile">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                    <div className="pagination-desktop">
                        <div>
                            <p className="pagination-info">
                                Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
                                </span> trong <span className="font-medium">{filteredPayments.length}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="pagination-nav">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className={`pagination-nav-btn first ${currentPage === 1 ? 'disabled' : ''}`}
                                >
                                    &lt;&lt;
                                </button>

                                <button className="pagination-nav-btn current">
                                    {currentPage}
                                </button>

                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="pagination-nav-btn next"
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}

                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`pagination-nav-btn last ${currentPage === totalPages ? 'disabled' : ''}`}
                                >
                                    &gt;&gt;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}