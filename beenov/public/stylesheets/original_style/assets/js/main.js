userDropdown = {
  initEvents: function() {
    this.button.addEventListener("click", function(e) {
      e.preventDefault();
      if (userDropdown.dropdown.style.display == "block") {
        userDropdown.dropdown.style.display = "none";
      } else {
        userDropdown.dropdown.style.display = "block";
      }
    });

    window.addEventListener("click", function(e) {
      if (userDropdown.dropdown.style.display == "block" && (e.target != userDropdown.button && e.target.parentNode != userDropdown.button)) {
        console.log(e.target);
        userDropdown.dropdown.style.display = "none";
      }
    });
  },

  init: function() {
    this.button = document.getElementById("user-btn");
    this.dropdown = document.getElementById("dropdown-menu");

    if (this.button && this.dropdown) {
      this.initEvents();
    }
  }
}

userDropdown.init();
