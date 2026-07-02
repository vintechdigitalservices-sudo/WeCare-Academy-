// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIM_jh15J2riP1XXtxP4hCmlbx1BqK5-8",
  authDomain: "wecare--verification.firebaseapp.com",
  projectId: "wecare--verification",
  storageBucket: "wecare--verification.firebasestorage.app",
  messagingSenderId: "198997154830",
  appId: "1:198997154830:web:a732dc7abc306ed1a5f05f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (mobileMenu && navList) {
  mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navList.classList.remove('active');
    });
  });
}

// ==========================================
// COURSE DATA (Prices in NGN, Image Mapping)
// ==========================================
const courses = [
  { id: "course_1", title: "Ethics and Principles of Caregiving", price: 49000, oldPrice: 65000, image: "course1.jpg" },
  { id: "course_2", title: "Basic Health Assessment and Observation Techniques", price: 49000, oldPrice: 65000, image: "course2.jpg" },
  { id: "course_3", title: "Basic Life Support (BLS)", price: 25000, oldPrice: 35000, image: "course3.jpg" },
  { id: "course_4", title: "Therapy in Caregiving", price: 26500, oldPrice: 38000, image: "course4.jpg" },
  { id: "course_5", title: "Geriatric Care: Understanding Ageing", price: 49000, oldPrice: 65000, image: "course5.jpg" },
  { id: "course_6", title: "Dementia and other Cognitive Diseases", price: 23000, oldPrice: 32000, image: "course6.jpg" },
  { id: "course_7", title: "Palliative and End-of-Life Care", price: 25000, oldPrice: 35000, image: "course7.jpg" },
  { id: "course_8", title: "Nutrition in Caregiving", price: 23000, oldPrice: 32000, image: "course8.jpg" }
];

// ==========================================
// RENDER COURSES & FIREBASE LIKES
// ==========================================
const courseContainer = document.getElementById('course-container');

if (courseContainer) {
  courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card section-hidden';
    card.innerHTML = `
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
        <a href="#" class="btn-primary" style="margin-top: 15px; text-align: center; padding: 10px;">View Course</a>
      </div>
    `;
    courseContainer.appendChild(card);

    const likeBtn = card.querySelector('.course-like');
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    const docRef = doc(db, "likes", course.id);

    // Initial load state
    if (localStorage.getItem(`liked_${course.id}`)) {
      likeBtn.classList.add('liked');
      heartIcon.className = "fa-solid fa-heart";
    }

    // Real-time listener
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().count !== undefined) {
        likeCount.textContent = docSnap.data().count;
      }
    });

    // Toggle click submission handler
    likeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const isCurrentlyLiked = likeBtn.classList.contains('liked');
      
      // Toggle immediately for snappy UX
      const willBeLiked = !isCurrentlyLiked;
      likeBtn.classList.toggle('liked', willBeLiked);
      heartIcon.className = willBeLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
      
      if (willBeLiked) {
        localStorage.setItem(`liked_${course.id}`, "true");
      } else {
        localStorage.removeItem(`liked_${course.id}`);
      }

      try {
        await setDoc(docRef, { count: increment(willBeLiked ? 1 : -1) }, { merge: true });
      } catch (error) {
        console.error("Firestore toggle error:", error);
        // Rollback on failure
        likeBtn.classList.toggle('liked', isCurrentlyLiked);
        heartIcon.className = isCurrentlyLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
        if (isCurrentlyLiked) localStorage.setItem(`liked_${course.id}`, "true");
        else localStorage.removeItem(`liked_${course.id}`);
      }
    });
  });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS (PERSISTENT OBSERVATION)
// ==========================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  const hiddenElements = document.querySelectorAll('.section-hidden, .icon-card, .feature-card, .testimonial-card, .faq-item, .step');
  hiddenElements.forEach(el => observer.observe(el));
});

// ==========================================
// FAQ ACCORDION
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(f => f.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  }
});

// ==========================================
// SMOOTH SCROLL FOR NAV LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
