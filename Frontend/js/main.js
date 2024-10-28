(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        animateOut: 'fadeOutLeft',
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    
})(jQuery);


document.addEventListener('DOMContentLoaded', function () {

    //Edit user's profile S.M
    const profileUserInfo = document.getElementById('profileUserInfo');
    if (profileUserInfo) {
        profileUserInfo.addEventListener('submit', (e) => {
            // Define variables for profile form
            const profileName = document.getElementById('profileName').value;
            const profileEmail = document.getElementById('profileEmail').value;
            const profilePhone = document.getElementById('profilePhone').value;
            const profileGender = document.getElementById('profileGender').value;
            const profileDateOfBirth = document.getElementById('profileDateOfBirth').value;
            const profileError = document.getElementById("profileError");
            const profileErrorMessage = document.getElementById("profileErrorMessage");

            e.preventDefault();
            let errorMessage = [];

            // Validate Name
            if (!/^[a-zA-Z\s]+$/.test(profileName)) {
                errorMessage.push("Name must contain only letters");
            }

            // Validate Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(profileEmail)) {
                errorMessage.push("Please enter a valid email address");
            }

            // Validate Phone
            const phonePattern = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/; 
            if (!phonePattern.test(profilePhone)) {
                errorMessage.push("Phone number must be 10 digits long and contain only numbers");
            }

            // Validate Gender
            if (profileGender === '') {
                errorMessage.push("Gender selection is required");
            }

            // Validate Date of Birth
            if (!Date.parse(profileDateOfBirth)) {
                errorMessage.push("Please enter a valid date of birth");
            }

            // Show error messages if any
            if (errorMessage.length > 0) {
                profileError.style.display = "block";
                profileErrorMessage.innerText = errorMessage.join(", ");
            } else {
                // Proceed with form submission or further processing
                profileError.style.display = "none";
                // Add your form submission logic here
            }
        });
    }   

    // Change Password and Image Form Submission S.M
    // Change Password Form Submission
    const settingPassChangeForm = document.getElementById('settingPassChangeForm');
    if (settingPassChangeForm) {
        settingPassChangeForm.addEventListener('submit', (e) => {
        
            console.log("change");
    
            //define  the valuables for the form
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const passwordError = document.getElementById("passwordError");
            const passwordErrorMessage = document.getElementById("passwordErrorMessage");
    
            //prevent page from reloading
            e.preventDefault();
    
            let errorMessage = [];
    
            // Validate Old Password
            if (oldPassword === '') {
                errorMessage.push("Old password is required");
            }
    
            // Validate New Password
            if (newPassword === '') {
                errorMessage.push("New password is required");
            } else if (newPassword.length < 6) {
                errorMessage.push("New password must be at least 6 characters long");
            }
    
            // Validate Confirm Password
            if (confirmPassword === '') {
                errorMessage.push("Confirm password is required");
            } else if (newPassword !== confirmPassword) {
                errorMessage.push("New password and confirm password do not match");
            }
    
            // Show error messages if any
            if (errorMessage.length > 0) {
                passwordError.style.display = "block";
                passwordErrorMessage.innerText = errorMessage.join(", ");
            } else {
                // Proceed with form submission or further processing
                passwordError.style.display = "none";
    
                // // AJAX Request to Change Password
                // $.ajax({
                //     type: 'POST',
                //     url: 'change-password.php', // Replace with your server-side script
                //     data: { oldPassword: oldPassword, newPassword: newPassword },
                //     success: function(response) {
                //         if (response === 'success') {
                //             alert('Password changed successfully!');
                //             settingForm.reset(); // Reset the form
                //         } else {
                //             passwordError.style.display = "block";
                //             passwordErrorMessage.innerText = 'Failed to change password!';
                //         }
                //     },
                //     error: function() {
                //         passwordError.style.display = "block";
                //         passwordErrorMessage.innerText = 'An error occurred while changing the password!';
                //     }
                // });
            }
        });
    }
        // Change Profile Image Form Submission S.M
        const settingProfileImageForm = document.getElementById('settingProfileImageForm');
        const profileImageInput = document.getElementById('profileImage');
        const profileImagePreview = document.getElementById('profileImagePreview');
        const profileImageContainer = document.getElementById('profileImageContainer');
        const imageError = document.getElementById("imageError");
        const imageErrorMessage = document.getElementById("imageErrorMessage");
    
        // Make the image clickable to open the file input
        profileImageContainer.addEventListener('click', function () {
            profileImageInput.click();
        });
    
        // Handle the file input change event
        profileImageInput.addEventListener('change', function (e) {
            e.preventDefault();
            const file = e.target.files[0];
    
            // Check if the selected file is an image
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    // Set the new image source
                    profileImagePreview.src = event.target.result;
                    imageError.style.display = "none"; // Hide error if valid image
                };
                reader.readAsDataURL(file);
            } else {
                // Show error if the file is not an image
                imageError.style.display = "block";
                imageErrorMessage.innerText = "Please select a valid image file!";
                profileImagePreview.src = "img/userImage.png"; // Reset to default image
            }
        });

        // Handle image form submission S.M
        settingProfileImageForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            const file = profileImageInput.files[0];

            // Check if the file is selected and is an image
            if (!file) {
                imageError.style.display = "block";
                imageErrorMessage.innerText = "No file selected!";
                return;
            }

            if (!file.type.startsWith('image/')) {
                imageError.style.display = "block";
                imageErrorMessage.innerText = "Please select a valid image file!";
                return;
            }

            // If valid, proceed with form submission (e.g., AJAX request)
            imageError.style.display = "none"; // Hide error
            // Here you can add your AJAX request to submit the form data
            console.log("Form submitted with image:", file);
            // Example: submit the form data using FormData
            const formData = new FormData(settingProfileImageForm);
            // Send formData using fetch or XMLHttpRequest
        });
});
