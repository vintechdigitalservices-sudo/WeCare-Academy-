// ============================================
// WeCare Nursing Services Academy — Script
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIM_jh15J2riP1XXtxP4hCmlbx1BqK5-8",
  authDomain: "wecare--verification.firebaseapp.com",
  projectId: "wecare--verification",
  storageBucket: "wecare--verification.firebasestorage.app",
  messagingSenderId: "198997154830",
  appId: "1:198997154830:web:a732dc7abc306ed1a5f05f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---- Course data ----
const courses = [
  { id: "course_1", title: "Ethics and Principles of Caregiving", price: 49000, oldPrice: 65000, image: "course1.jpg", link: "#" },
  { id: "course_2", title: "Basic Health Assessment and Observation Techniques", price: 49000, oldPrice: 65000, image: "course2.jpg", link: "#" },
  { id: "course_3", title: "Basic Life Support (BLS)", price: 25000, oldPrice: 35000, image: "course3.jpg", link: "#" },
  { id: "course_4", title: "Therapy in Caregiving", price: 26500, oldPrice: 38000, image: "course4.jpg", link: "#" },
  { id: "course_5", title: "Geriatric Care: Understanding Ageing", price: 49000, oldPrice: 65000, image: "course5.jpg", link: "#" },
  { id: "course_6", title: "Dementia and other Cognitive Diseases", price: 23000, oldPrice: 32000, image: "course6.jpg", link: "#" },
  { id: "course_7", title: "Palliative and End-of-Life Care", price: 25000, oldPrice: 35000, image: "course7.jpg", link: "#" },
  { id: "course_8", title: "Nutrition in Caregiving", price: 23000, oldPrice: 32000, image: "course8.jpg", link: "#" }
];

// ---- Render Courses with Firebase Likes ----
function renderCourses() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;

  grid.innerHTML = courses.map(course => `
    <article class="course-card" data-id="${course.id}">
      <img src="${course.image}" alt="${course.title}" class="course-img" onerror="this.src='https://via.placeholder.com/280x180/0A3C36/ffffff?text=Caregiving+Course'">
      <div class="course-body">
        <h3>${course.title}</h3>
        <ul class="course-bullets">
          <li><i class="fa-solid fa-graduation-cap"></i> Self paced</li>
          <li><i class="fa-solid fa-certificate"></i> Recognized Certificate</li>
          <li><i class="fa-solid fa-briefcase"></i> Career Ready</li>
          <li><i class="fa-solid fa-globe"></i> Global Standards</li>
        </ul>
        <div class="course-footer">
          <span class="course-like" data-id="${course.id}">
            <i class="fa-regular fa-heart"></i>
            <span class="like-count">0</span>
          </span>
          <div class="course-price">
            <span class="price-current">₦${course.price.toLocaleString()}</span>
            <span class="price-old">₦${course.oldPrice.toLocaleString()}</span>
          </div>
        </div>
        <a href="${course.link}" class="btn btn-primary" style="margin-top: 15px; text-align: center; padding: 10px; width: 100%; border-radius: 8px;">View Course</a>
      </div>
    </article>
  `).join('');

  // Attach Firebase logic to each card
  document.querySelectorAll('.course-card').forEach(card => {
    const likeBtn = card.querySelector('.course-like');
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    const courseId = likeBtn.dataset.id;
    const docRef = doc(db, "likes", courseId);

    if (localStorage.getItem(`liked_${courseId}`)) {
      likeBtn.classList.add('liked');
      heartIcon.className = "fa-solid fa-heart";
    }

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().count !== undefined) {
        likeCount.textContent = docSnap.data().count;
      }
    });

    likeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const isCurrentlyLiked = likeBtn.classList.contains('liked');
      const willBeLiked = !isCurrentlyLiked;
      
      likeBtn.classList.toggle('liked', willBeLiked);
      heartIcon.className = willBeLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
      
      if (willBeLiked) localStorage.setItem(`liked_${courseId}`, "true");
      else localStorage.removeItem(`liked_${courseId}`);

      try {
        await setDoc(docRef, { count: increment(willBeLiked ? 1 : -1) }, { merge: true });
      } catch (error) {
        console.error("Firestore toggle error:", error);
        likeBtn.classList.toggle('liked', isCurrentlyLiked);
        heartIcon.className = isCurrentlyLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
        if (isCurrentlyLiked) localStorage.setItem(`liked_${courseId}`, "true");
        else localStorage.removeItem(`liked_${courseId}`);
      }
    });
  });
}

// ---- Courses Dropdown Toggle ----
function initDropdown() {
  const toggle = document.getElementById('coursesToggle');
  const dropdown = toggle?.closest('.nav-dropdown');
  if (!toggle || !dropdown) return;

  function openDropdown() {
    dropdown.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown() {
    dropdown.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  dropdown.querySelectorAll('.dropdown-item, .dropdown-view-all').forEach(item => {
    item.addEventListener('click', () => closeDropdown());
  });
}

// ---- Mobile Nav Toggle ----
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
  });
}

// ---- Smooth Scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// SCROLL REVEAL OBSERVER (Industrial Animation)
// ============================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-hidden').forEach(el => observer.observe(el));
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

// ============================================
// ADDED: STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('.stat-number');
  let started = false; // Ensure it only runs once

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps

          let current = 0;
          const updateCount = () => {
            current += increment;
            if (current < target) {
              // Add commas for numbers over 999 (like 5000)
              counter.innerText = Math.ceil(current).toLocaleString();
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target.toLocaleString();
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

  observer.observe(statsSection);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  initDropdown();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initFaqAccordion();
  initStatsCounter(); // <--- ADDED THIS LINE
});