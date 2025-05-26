import React, { useState, useEffect } from 'react';
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
    const [statusFilter, setStatusFilter] = useState('ALL'); 
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const getDateString = (dateInput) => {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
                }

                let allPayments = [];
                let page = 1;
                let hasMore = true;
                
                while (hasMore) {
                    const response = await fetch(`http://localhost:5000/api/payment/transactions?page=${page}&limit=100`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
                        } else if (response.status === 403) {
                            throw new Error('Bạn không có quyền truy cập dữ liệu này.');
                        } else {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    }
                    
                    const data = await response.json();
                    
                  
                    const transformedPayments = data.transactions.map((transaction, index) => ({
                        id: transaction._id,
                        landlordName: transaction.userId?.full_name || 'N/A',
                        landlordEmail: transaction.userId?.email || 'N/A',
                        amount: transaction.amount || 0,
                        paymentDate: transaction.createdAt,
                        duration: transaction.planType === 'WEEKLY' ? '1 tuần' : 
                                transaction.planType === 'MONTHLY' ? '1 tháng' : 
                                transaction.planType === 'QUARTERLY' ? '3 tháng' : 
                                transaction.planType === 'YEARLY' ? '1 năm' : 'N/A',
                        method: transaction.paymentMethod === 'PAYOS' ? 'PayOS' : 
                               transaction.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : 
                               transaction.paymentMethod || 'N/A',
                        status: transaction.status,
                        orderInfo: transaction.orderInfo || '',
                        transactionId: transaction.transactionId || ''
                    }));
                    
                    allPayments = [...allPayments, ...transformedPayments];
                    
                    const totalPages = Math.ceil(data.pagination.total / 100);
                    hasMore = page < totalPages;
                    page++;
                }
                
                
                setPayments(allPayments);
                setError(null);
                
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

  
    const totalPayments = payments.length;
    const completedPayments = payments.filter(payment => payment.status === 'COMPLETED');
    const pendingPayments = payments.filter(payment => payment.status === 'PENDING');
    const failedPayments = payments.filter(payment => payment.status === 'FAILED');
    
    const completedRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedCount = completedPayments.length;
    const pendingCount = pendingPayments.length;
    const failedCount = failedPayments.length;

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            payment.landlordEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;

        let matchesDateRange = true;
        if (startDate && endDate) {
            const paymentDateString = getDateString(payment.paymentDate);
            const filterStartDateString = startDate; 
            const filterEndDateString = endDate; 
            
            matchesDateRange = paymentDateString >= filterStartDateString && 
                             paymentDateString <= filterEndDateString;
        } else if (startDate) {
            const paymentDateString = getDateString(payment.paymentDate);
            const filterStartDateString = startDate;
            matchesDateRange = paymentDateString >= filterStartDateString;
        } else if (endDate) {
            const paymentDateString = getDateString(payment.paymentDate);
            const filterEndDateString = endDate;
            matchesDateRange = paymentDateString <= filterEndDateString;
        }

        return matchesSearch && matchesDateRange && matchesStatus;
    });

    const filteredPaymentsCount = filteredPayments.length;
    const filteredCompletedPayments = filteredPayments.filter(payment => payment.status === 'COMPLETED');
    const filteredPendingPayments = filteredPayments.filter(payment => payment.status === 'PENDING');
    const filteredFailedPayments = filteredPayments.filter(payment => payment.status === 'FAILED');
    
    const filteredCompletedRevenue = filteredCompletedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const filteredCompletedCount = filteredCompletedPayments.length;
    const filteredPendingCount = filteredPendingPayments.length;
    const filteredFailedCount = filteredFailedPayments.length;

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (sortBy === 'paymentDate') {
            return sortOrder === 'asc'
                ? new Date(a.paymentDate) - new Date(b.paymentDate)
                : new Date(b.paymentDate) - new Date(a.paymentDate);
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
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return (
                    <span className="status-badge-rev success-rev">
                        <CheckCircle size={16} className="status-icon-rev" /> Thành công
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="status-badge-rev processing-rev">
                        Đang xử lý
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="status-badge-rev failed-rev">
                        Thất bại
                    </span>
                );
            default:
                return (
                    <span className="status-badge-rev">
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container-rev">
                <div className="header-rev">
                    <h1 className="header-title-rev">Quản Lý Doanh Thu</h1>
                    <p className="header-subtitle-rev">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container-rev">
                <div className="header-rev">
                    <h1 className="header-title-rev">Quản Lý Doanh Thu</h1>
                    <p className="header-subtitle-rev">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container-rev">
            {/* Header */}
            <div className="header-rev">
                <h1 className="header-title-rev">Quản Lý Doanh Thu</h1>
                <p className="header-subtitle-rev">Theo dõi các khoản thanh toán từ chủ trọ</p>
            </div>

            {/* Stats Overview - Updated to 5 cards with different colored values */}
            <div className="stats-grid-rev">
                <div className="stat-card-rev">
                    <p className="stat-label-rev">Tổng doanh thu (thành công)</p>
                    <p className="stat-value-rev revenue-success-rev">
                        {completedRevenue.toLocaleString('vi-VN')} đ
                    </p>
                </div>

                <div className="stat-card-rev">
                    <p className="stat-label-rev">Tổng số thanh toán</p>
                    <p className="stat-value-rev total-payments-rev">{totalPayments}</p>
                </div>

                <div className="stat-card-rev">
                    <p className="stat-label-rev">Thanh toán thành công</p>
                    <p className="stat-value-rev success-payments-rev">{completedCount}</p>
                </div>

                <div className="stat-card-rev">
                    <p className="stat-label-rev">Thanh toán đang xử lý</p>
                    <p className="stat-value-rev pending-payments-rev">{pendingCount}</p>
                </div>

                <div className="stat-card-rev">
                    <p className="stat-label-rev">Thanh toán thất bại</p>
                    <p className="stat-value-rev failed-payments-rev">{failedCount}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="controls-container-rev">
                <div className="controls-left-rev">
                    <div className="search-container-rev">
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email chủ trọ..."
                            className="search-input-rev"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon-rev" size={18} />
                    </div>

                    {/* Status Filter */}
                    <div className="status-filter-container-rev">
                        <select
                            className="status-filter-select-rev"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="COMPLETED">Thành công</option>
                            <option value="PENDING">Đang xử lý</option>
                            <option value="FAILED">Thất bại</option>
                        </select>
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

                        <button
                            className="reset-filter-btn-rev"
                            onClick={() => {
                                setStartDate('');
                                setEndDate('');
                                setCurrentPage(1);
                            }}
                            disabled={!startDate && !endDate}
                        >
                            Bỏ lọc
                        </button>
                    </div>

                    {(startDate || endDate) && (
                        <div className="filtered-stats-rev">
                            <div className="filtered-stats-container-rev">
                                <div>
                                    <h4 className="filtered-stats-title-rev">Thông tin thống kê (thời gian đã lọc)</h4>
                                    <div className="filtered-stats-grid-rev">
                                        <div>
                                            <p className="filtered-stat-label-rev">Tổng doanh thu (thành công):</p>
                                            <p className="filtered-stat-value-rev revenue-success-rev">{filteredCompletedRevenue.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label-rev">Tổng số thanh toán:</p>
                                            <p className="filtered-stat-value-rev total-payments-rev">{filteredPaymentsCount}</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label-rev">Thanh toán thành công:</p>
                                            <p className="filtered-stat-value-rev success-payments-rev">{filteredCompletedCount}</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label-rev">Đang xử lý:</p>
                                            <p className="filtered-stat-value-rev pending-payments-rev">{filteredPendingCount}</p>
                                        </div>
                                        <div>
                                            <p className="filtered-stat-label-rev">Thanh toán thất bại:</p>
                                            <p className="filtered-stat-value-rev failed-payments-rev">{filteredFailedCount}</p>
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
                            <th className="table-header-cell-rev">
                                Email
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
                                onClick={() => handleSort('paymentDate')}
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
                                    <div className="landlord-email-rev">{payment.landlordEmail}</div>
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
                                    {formatDate(payment.paymentDate)}
                                </td>
                                <td className="table-cell-rev">
                                    {payment.method}
                                </td>
                                <td className="table-cell-rev">
                                    {getStatusBadge(payment.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {paginatedPayments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        Không có dữ liệu thanh toán nào.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
            </div>
        </div>
    );
}