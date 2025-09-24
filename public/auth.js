document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Əgər istifadəçi giriş etməyibsə və login səhifəsində deyilsə, login səhifəsinə yönləndir
    if (!token && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
        return; // Yönləndirmədən sonra kodun icrasını dayandır
    }

    // Naviqasiya menyusunu yüklə və səhifəyə yerləşdir
    // Yalnız naviqasiya üçün yer olan səhifələrdə işləsin
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('nav.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;

                // İstifadəçi roluna görə admin menyusunu gizlət
                if (role !== 'admin') {
                    document.querySelectorAll('.admin-only').forEach(el => {
                        el.style.display = 'none';
                    });
                }
            })
            .catch(error => console.error('Error fetching nav.html:', error));
    }
});

// Logout funksiyasını qlobal olaraq əlçatan etmək üçün
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}
