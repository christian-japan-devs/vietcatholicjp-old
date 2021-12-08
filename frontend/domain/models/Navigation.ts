export const navigation = {
  pages: [
    { name: "Thông báo", href: "#" },
    { name: "Giới thiệu", href: "#" },
  ],
  tabs: [
    {
      id: "thanhle",
      name: "Thánh Lễ",
      href: "#",
      items: [
        { name: "Lịch giờ Lễ", href: "/mass/masstime" },
        { name: "Lịch giải tội", href: "#" },
        { name: "Nhà thờ", href: "#" },
        { name: "Đăng ký", href: "/mass/register" },
      ],
    },
    {
      id: "phungvu",
      name: "Phụng vụ",
      href: "#",
      items: [
        { name: "Lời chúa", href: "#" },
        { name: "Suy niệm", href: "#" },
        { name: "Kinh nguyện", href: "#" },
        { name: "Thánh ca", href: "#" },
      ],
    },
    {
      id: "mucvu",
      name: "Mục vụ",
      href: "#",
      items: [
        { name: "Tông thư", href: "#" },
        { name: "Tông huấn", href: "#" },
        { name: "Đức tin", href: "#" },
      ],
    },
    {
      id: "giaoly",
      name: "Giáo lý",
      href: "#",
      items: [
        { name: "Thiếu nhi", href: "#" },
        { name: "Tân tòng", href: "#" },
        { name: "Hôn phối", href: "#" },
      ],
    },
    {
      id: "lienlac",
      name: "Liên lạc",
      href: "#",
      items: [
        { name: "Quý Cha", href: "#" },
        { name: "Dòng tu", href: "#" },
        { name: "Hội đoàn", href: "#" },
        { name: "Nhóm giới trẻ", href: "#" },
      ],
    },
  ],
  auth: {
    signup: {
      name: "Đăng ký",
      href: "/auth/signup",
    },
    login: {
      name: "Đăng nhập",
      href: "/auth/login",
    },
    logout: {
      name: "Đăng xuất",
      href: "/auth/logout",
    },
  },
};
