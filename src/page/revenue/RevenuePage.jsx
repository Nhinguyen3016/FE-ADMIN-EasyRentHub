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
        <div className="dashboard-container-rev">
            {/* Header */}
            <div className="header-rev">
                <h1 className="header-title-rev">Quản Lý Doanh Thu</h1>
                <p className="header-subtitle-rev">Theo dõi các khoản thanh toán từ chủ trọ</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid-rev">
                <div className="stat-card-rev">
                    <p className="stat-label-rev">Tổng doanh thu</p>
                    <p className="stat-value-rev revenue-rev">
                        {totalRevenue.toLocaleString('vi-VN')} đ
                    </p>
                </div>

                <div className="stat-card-rev">
                    <p className="stat-label-rev">Số lượng thanh toán</p>
                    <p className="stat-value-rev payments-rev">{totalPayments}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="controls-container-rev">
                <div className="controls-left-rev">
                    <div className="search-container-rev">
                        <input
                            type="text"
                            placeholder="Tìm theo tên chủ trọ..."
                            className="search-input-rev"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon-rev" size={18} />
                    </div>

                    <button
                        className="filter-button-rev"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} />
                        <span>Lọc</span>
                    </button>
                </div>
            </div>

            {/* Filter dropdown */}
            {isFilterOpen && (
                <div className="filter-dropdown-rev">
                    <h3 className="filter-title-rev">Lọc theo khoảng thời gian</h3>
                    <div className="date-filters-rev">
                        <div className="date-input-group-rev">
                            <span className="date-label-rev">Từ ngày:</span>
                            <div className="date-input-container-rev">
                                <input
                                    type="date"
                                    className="date-input-rev"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <Calendar className="date-icon-rev" size={18} />
                            </div>
                        </div>

                        <div className="date-input-group-rev">
                            <span className="date-label-rev">Đến ngày:</span>
                            <div className="date-input-container-rev">
                                <input
                                    type="date"
                                    className="date-input-rev"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <Calendar className="date-icon-rev" size={18} />
                            </div>
                        </div>
                    </div>

                    {(startDate || endDate) && (
                        <div className="filtered-stats-rev">
                            <div className="filtered-stats-container-rev">
                                <div>
                                    <h4 className="filtered-stats-title-rev">Thông tin thống kê (thời gian đã lọc)</h4>
                                    <div className="filtered-stats-grid-rev">
                                        <div>
                                            <p className="filtered-stat-label-rev">Tổng doanh thu:</p>
                                            <p className="filtered-stat-value-rev revenue-rev">{filteredRevenue.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label-rev">Số thanh toán:</p>
                                            <p className="filtered-stat-value-rev payments-rev">{filteredPaymentsCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="table-container-rev">
                <table className="data-table-rev">
                    <thead className="table-header-rev">
                        <tr>
                            <th
                                className="table-header-cell-rev sortable-rev"
                                onClick={() => handleSort('stt')}
                            >
                                <div className="header-content-rev">
                                    <span>STT</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="table-header-cell-rev sortable-rev"
                                onClick={() => handleSort('name')}
                            >
                                <div className="header-content-rev">
                                    <span>Chủ trọ</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="table-header-cell-rev sortable-rev"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="header-content-rev">
                                    <span>Số tiền</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th className="table-header-cell-rev">
                                Thời hạn
                            </th>
                            <th
                                className="table-header-cell-rev sortable-rev"
                                onClick={() => handleSort('date')}
                            >
                                <div className="header-content-rev">
                                    <span>Ngày thanh toán</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th className="table-header-cell-rev">
                                Phương thức
                            </th>
                            <th className="table-header-cell-rev">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-body-rev">
                        {paginatedPayments.map((payment, index) => (
                            <tr key={payment.id} className="table-row-rev">
                                <td className="table-cell-rev">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="table-cell-rev">
                                    <div className="landlord-name-rev">{payment.landlordName}</div>
                                </td>
                                <td className="table-cell-rev">
                                    <div className="amount-rev">
                                        {payment.amount.toLocaleString('vi-VN')} đ
                                    </div>
                                </td>
                                <td className="table-cell-rev">
                                    {payment.duration}
                                </td>
                                <td className="table-cell-rev">
                                    {new Date(payment.date).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="table-cell-rev">
                                    {payment.method}
                                </td>
                                <td className="table-cell-rev">
                                    <span className="status-badge-rev success-rev">
                                        <CheckCircle size={16} className="status-icon-rev" /> Thành công
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container-rev">
                    <div className="pagination-mobile-rev">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`pagination-btn-rev ${currentPage === 1 ? 'disabled-rev' : ''}`}
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`pagination-btn-rev ${currentPage === totalPages ? 'disabled-rev' : ''}`}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                    <div className="pagination-desktop-rev">
                        <div>
                            <p className="pagination-info-rev">
                                Hiển thị <span className="font-medium-rev">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium-rev">
                                    {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
                                </span> trong <span className="font-medium-rev">{filteredPayments.length}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="pagination-nav-rev">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className={`pagination-nav-btn-rev first-rev ${currentPage === 1 ? 'disabled-rev' : ''}`}
                                >
                                    &lt;&lt;
                                </button>

                                <button className="pagination-nav-btn-rev current-rev">
                                    {currentPage}
                                </button>

                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="pagination-nav-btn-rev next-rev"
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}

                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`pagination-nav-btn-rev last-rev ${currentPage === totalPages ? 'disabled-rev' : ''}`}
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