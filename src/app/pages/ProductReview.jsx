import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, ChevronRight, User, ThumbsUp, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function ProductReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getProduct, getReviewsByProductId, addReview } = useProducts();
    const { user } = useAuth();

    const product = getProduct(id);

    // --- STATE ---
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    
    // Thêm state cho bộ lọc
    const [filterOption, setFilterOption] = useState("all"); // "all", "5", "4", "3", "2", "1"

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    // --- GỌI API LẤY BÌNH LUẬN ---
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            const cleanId = String(id).split(':')[0];
            const data = await getReviewsByProductId(cleanId);
            setReviews(data.reverse());
            setIsLoadingReviews(false);
        };

        if (id) fetchReviews();
    }, [id]);

    // --- LOGIC LỌC ĐÁNH GIÁ ---
    // Sử dụng useMemo để tính toán lại danh sách chỉ khi reviews hoặc filterOption thay đổi
    const filteredReviews = useMemo(() => {
        if (filterOption === "all") {
            return reviews; // Mặc định là mới nhất (vì đã reverse() lúc fetch)
        }
        
        // Lọc theo số sao cụ thể
        const starCount = parseInt(filterOption, 10);
        return reviews.filter(review => review.rating === starCount);
    }, [reviews, filterOption]);


    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
                <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">
                    Quay lại danh sách sản phẩm
                </button>
            </div>
        );
    }

    // --- XỬ LÝ GỬI BÌNH LUẬN ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Vui lòng đăng nhập để gửi đánh giá');
            navigate('/login');
            return;
        }
        if (rating === 0) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }

        const newReview = {
            productId: Number(id),
            author: user.name || user.email || "Khách hàng",
            rating: rating,
            date: new Date().toLocaleDateString('vi-VN'),
            content: reviewText,
            images: []
        };

        const savedReview = await addReview(newReview);

        if (savedReview) {
            toast.success("Đánh giá của bạn đã được gửi thành công!");
            setReviews([savedReview, ...reviews]);
            setRating(0);
            setReviewText("");
            // Tùy chọn: Đặt lại bộ lọc về "all" để thấy ngay bình luận mới
            setFilterOption("all"); 
        } else {
            toast.error("Lỗi khi lưu đánh giá. Vui lòng thử lại!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="max-w-6xl mx-auto px-4">

                {/* THANH ĐIỀU HƯỚNG BÊN TRÊN (Giữ nguyên) */}
                <div className="flex items-center text-sm text-gray-500 mb-6 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => navigate(`/products/${id}`)}
                        className="flex items-center gap-1 hover:text-black mr-6 font-medium transition-colors bg-white px-3 py-1.5 rounded-lg border shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại sản phẩm
                    </button>

                    <span className="hidden sm:flex items-center">
                        <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Trang chủ</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span onClick={() => navigate('/products')} className="hover:text-black cursor-pointer">Sản phẩm</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-medium text-black">Đánh giá sản phẩm</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================= CỘT TRÁI (Giữ nguyên) ================= */}
                    <div className="space-y-6">
                        {/* 1. Tóm tắt Sản phẩm */}
                        <div
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-shadow group"
                            onClick={() => navigate(`/product/${id}`)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-100 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h2 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h2>
                                    <p className="text-gray-500 text-sm line-clamp-1">{product.category}</p>
                                </div>
                                <div className="font-semibold text-blue-600 text-lg">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </div>
                            </div>
                        </div>

                        {/* 2. Form Viết Đánh giá */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                            <h3 className="font-bold text-lg mb-4">Viết đánh giá của bạn</h3>

                            <form onSubmit={handleSubmitReview}>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-200"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    rows="4"
                                    placeholder="Chia sẻ trải nghiệm của bạn (tối thiểu 50 ký tự)..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none mb-3 text-sm"
                                />

                                <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4">
                                    <ImageIcon className="w-5 h-5" /> Thêm hình ảnh
                                </button>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    Gửi Đánh Giá
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI ================= */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Header Cột phải có SELECT FILTER */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                {/* Hiển thị số lượng dựa trên mảng ĐÃ LỌC */}
                                Tất cả đánh giá
                                <span className="text-gray-500 text-sm font-normal">({filteredReviews.length} lượt)</span>
                            </h3>
                            
                            {/* Cập nhật thẻ select để thay đổi state */}
                            <select 
                                value={filterOption} 
                                onChange={(e) => setFilterOption(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white cursor-pointer"
                            >
                                <option value="all">Mới nhất</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                        </div>

                        {/* Trạng thái Loading */}
                        {isLoadingReviews && (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                Đang tải đánh giá...
                            </div>
                        )}

                        {/* Trạng thái Trống (Chưa có đánh giá hoặc không có đánh giá nào khớp bộ lọc) */}
                        {!isLoadingReviews && filteredReviews.length === 0 && (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 flex flex-col items-center">
                                <Star className="w-12 h-12 text-gray-200 mb-3" />
                                <p>Không có đánh giá nào.</p>
                                {reviews.length > 0 && (
                                    <p className="text-sm mt-2 text-blue-500 cursor-pointer" onClick={() => setFilterOption("all")}>
                                        Hiển thị tất cả đánh giá
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Render Danh sách Review TỪ MẢNG FILTEREDREVIEWS */}
                        {!isLoadingReviews && filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{review.author}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{review.date}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                    {review.content}
                                </p>

                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="Hình ảnh đánh giá"
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-100 cursor-pointer hover:opacity-80 transition"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-black cursor-pointer w-fit">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Hữu ích</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
}