/* ============================================================
 * Plugin Core Init
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */
$(document).ready(function() {
    'use strict';
    // Initialize Search

    //Intialize Slider
  var slider = new Swiper('#demo-hero-3 .swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 1000
  });

  //Intialize Testamonials
  var testimonials_slider = new Swiper('#testimonial-1 .swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 1000,
      autoplay: 4000,
  });


  //Intialize Testamonials
  var gallery_slider = new Swiper('#gallery-slider .swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 1000,
      autoplay: 3000,
      slidesPerView: 3,
  });



});
