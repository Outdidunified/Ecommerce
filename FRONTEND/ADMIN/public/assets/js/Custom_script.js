document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-main ul.sidebar-links li');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent click from propagating if submenu is clicked
            event.stopPropagation();

            const submenu = link.querySelector('.sidebar-submenu');
            
            // Toggle submenu visibility on click
            if (submenu) {
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});
