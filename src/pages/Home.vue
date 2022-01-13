<script setup>
import { onMounted } from 'vue'

function previousTile() {
  const elm = document.querySelector('.showcase-3 > .content > .partners')
  const scrollLeft = elm.scrollLeft
  elm.scrollTo({ left: scrollLeft >= 1500 ? 0 : scrollLeft + 300, behavior: 'smooth' })
}

function nextTile() {
  const elm = document.querySelector('.showcase-3 > .content > .partners')
  const scrollLeft = elm.scrollLeft
  elm.scrollTo({ left: scrollLeft === 0 ? 1500 : scrollLeft - 300, behavior: 'smooth' })
}

function initializeAnimation() {
  const options = { threshold: 0.3 }
  const elements = document.querySelectorAll('[data-ows]')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, options)

  elements.forEach((elm) => {
    observer.observe(elm)
  })
}

onMounted(initializeAnimation)

</script>

<template>
  <div class="main">
    <div class="content">
      <h3 class="heading-1">
        Bienvenue chez <span>Chronotys</span>
      </h3>
      <div class="description-container">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed nisi eu odio facilisis congue et eu ante. Aenean eget est eu augue iaculis luctus. Aliquam sed quam magna. Nam lacinia, magna ut consequat pharetra.
      </div>
      <div class="action-container">
        <router-link to="/create-delivery" class="btn btn-secondary">
          Lancer une livraison
        </router-link>
      </div>
    </div>
    <div class="content"></div>
  </div>
  <div class="divider" />
  <div class="showcase-1">
    <h3 class="heading-2">Qui nous sommes</h3>
    <div class="content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo nibh leo, id pretium dui pulvinar at. Etiam sed nisi eu odio facilisis congue et eu ante. Aenean eget est eu augue iaculis luctus. Aliquam sed quam magna. Nam lacinia, magna ut consequat pharetra, neque sem facilisis tellus, vel fermentum purus elit in bibendum mi. Duis vulputate vulputate massa at lobortis. Aliquam ac semper leo. Sed convallis quis odio id semper. Aliquam erat volutpat. Vestibulum at faucibus sapien. Aliquam ornare sagittis pharetra
    </div>
  </div>
  <div class="divider" />
  <div class="showcase-2">
    <h3 class="heading-2">Nos secteurs cibles</h3>
    <div class="content">
      <div data-ows="scale-in" style="--delay: 0ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/restaurant.jpg" alt="Restaurant" class="item-image">
        </div>
        <h4 class="asset-item-title">Restaurant</h4>
      </div>
      <div data-ows="scale-in" style="--delay: 200ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/food.jpg" alt="Produits alimentaires" class="item-image">
        </div>
        <h4 class="asset-item-title">Produit-alimentaires</h4>
      </div>
      <div data-ows="scale-in" style="--delay: 300ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/high-tech.jpg" alt="High Tech" class="item-image">
        </div>
        <h4 class="asset-item-title">Électronique</h4>
      </div>
      <div data-ows="scale-in" style="--delay: 0ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/beauty.jpg" alt="Beauty" class="item-image">
        </div>
        <h4 class="asset-item-title">Beauté</h4>
      </div>
      <div data-ows="scale-in" style="--delay: 200ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/electro-1.jpeg" alt="Électroménager" class="item-image">
        </div>
        <h4 class="asset-item-title">Électroménager</h4>
      </div>
      <div data-ows="scale-in" style="--delay: 300ms" class="asset-item">
        <div class="asset-item-image-container">
          <img src="../assets/img/office.jpg" alt="Mobilier de bureau" class="item-image">
        </div>
        <h4 class="asset-item-title">Mobilier de bureau</h4>
      </div>
    </div>
  </div>
  <div class="divider" />
  <div class="showcase-3">
    <h3 class="heading-2">Nos fidèles partenaires</h3>
    <div class="content">
      <button class="btn btn-previous" @click="nextTile">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H5A2,2 0 0,0 3,5V19C3,20.11 3.9,21 5,21H19C20.11,21 21,20.11 21,19V5A2,2 0 0,0 19,3M15.71,16.59L14.29,18L8.29,12L14.29,6L15.71,7.41L11.12,12L15.71,16.59Z" />
          </svg>
        </i>
      </button>
      <button class="btn btn-next" @click="previousTile">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H5A2,2 0 0,0 3,5V19C3,20.11 3.9,21 5,21H19C20.11,21 21,20.11 21,19V5A2,2 0 0,0 19,3M9.71,18L8.29,16.59L12.88,12L8.29,7.41L9.71,6L15.71,12L9.71,18Z" />
          </svg>
        </i>
      </button>
      <div class="partners">
        <div class="partner-item">
          <img src="../assets/img/partners/BRS-BROKERS.jpeg" alt="BRS Brokers" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/EASTERN-PACIFIC-SHIPPING.jpeg" alt="EASTERN PACIFIC SHIPPING" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/MENA-ENERGY-DUBAI.png" alt="MENA ENERGY DUBAI" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/SIGNAL-MARITIME.png" alt="SIGNAL MARITIME" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/SONARA.jpeg" alt="SONARA" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/STEALTH-MARITIME.png" alt="STEALTH MARITIME" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/BRS-BROKERS.jpeg" alt="BRS Brokers" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/EASTERN-PACIFIC-SHIPPING.jpeg" alt="EASTERN PACIFIC SHIPPING" class="partner-item-image">
        </div>
        <div class="partner-item">
          <img src="../assets/img/partners/MENA-ENERGY-DUBAI.png" alt="MENA ENERGY DUBAI" class="partner-item-image">
        </div>
      </div>
    </div>
  </div>
  <div class="divider" />
  <div class="showcase-4">
    <h3 class="heading-2">Comment nous contacter</h3>
    <div class="content">
      <div data-ows="slide-left" class="contact-container">
        <div class="inner-box address">
          <h3 class="inner-box-title">
            <i class="icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
              </svg>
            </i>
            <span>Siège social</span>
          </h3>
          <div class="inner-box-content">
            Immeuble Fokam, Carrefour Iboutou, Douala, Cameroun
          </div>
        </div>
        <div class="inner-box email">
          <h3 class="inner-box-title">
            <i class="icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </i>
            <span>E-mail</span>
          </h3>
          <div class="inner-box-content">
            contact@chhronotys.com
          </div>
        </div>
        <div class="inner-box cellphone">
          <h3 class="inner-box-title">
            <i class="icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
              </svg>
            </i>
            <span>Téléphone</span>
          </h3>
          <div class="inner-box-content">
            (+237) 6 42 78 78 78
          </div>
        </div>
      </div>
      <div class="vertical-divider" />
      <div data-ows="slide-right" class="contact-form-container">
        <form class="contact-form" @submit.prevent="() => {}">
          <div class="form-group input-group">
            <div class="form-group">
              <input type="text" name="name" placeholder="Noms">
            </div>
            <div class="form-group">
              <input type="text" name="email" placeholder="Adresse e-mail">
            </div>
          </div>
          <div class="form-group">
            <input type="text" name="subject" placeholder="Objet du message">
          </div>
          <div class="form-group">
            <textarea name="message" id="message" rows="6" placeholder="Contenu du message"/>
          </div>
          <div class="form-group form-group-button">
            <button type="submit" class="btn btn-primary">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="socials">
      <a href="#" class="link facebook">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
          </svg>
        </i>
      </a>
      <a href="#" class="link twitter">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
          </svg>
        </i>
      </a>
      <a href="#" class="link linkedin">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
          </svg>
        </i>
      </a>
    </div>
    <div class="divider" />
    <div class="copyright">© Copyright Chronotys. All right reserved.</div>
  </div>
</template>

<style scoped>
.main > .content:first-child {
  float: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
  width: auto;
  height: 328px;
  background-color: var(--white);
}

.main > .content:first-child > .description-container {
  padding: 30px 0;
}

.main > .content:first-child > .action-container {
  padding: 8px 0;
}

.main > .content:first-child > .action-container > .btn {
  padding: 10px 26px;
  font-size: 1.1rem;
}

.main > .content:last-child {
  display: none;
  height: 480px;
  background-image: url("../assets/img/delivery-3.jpg");
  background-clip: border-box;
  background-origin: border-box;
  background-position: right;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #265c81;
}

.divider {
  width: 40vw;
  border-bottom: 1px solid #ebebeb;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

.vertical-divider {
  height: 360px;
  border-right: 1px solid #ebebeb;
}

.icon {
  display: inline-flex;
}

.btn > .icon > svg {
  height: 36px;
  width: 36px;
}

.heading-1 {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 1.2;
}

.heading-1 > span {
  font-family: "Helvetica Neue", Avenir, Arial, sans-serif;
  color: var(--purple-500);
  font-weight: 600;
  text-transform: uppercase;
}

.heading-2 {
  position: relative;
  margin: 0 0 20px;
  padding-left: 18px;
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 1.2;
}

.heading-2::before {
  content: "";
  width: 6px;
  border-radius: 2px;
  background-color: var(--purple-500);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

.showcase-1, .showcase-2, .showcase-3, .showcase-4 {
  padding: 5px 20px; /* responsive */
}

.showcase-1 > .content {
  padding: 8px 30px;
}

.showcase-2 > .content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 40px;
}

.showcase-3 > .content  {
  position: relative;
}

.showcase-3 > .content > .partners {
  margin-top: 28px;
  white-space: nowrap;
  overflow: hidden;
}

.showcase-3 > .content .btn {
  position: absolute;
  display: inline-flex;
  padding: 0;
  color: var(--purple-400);
  background-color: transparent;
  box-shadow: 0 0 6px 4px rgba(0, 0, 0, .02);
}

.showcase-3 > .content .btn:hover {
  background-color: transparent;
  color: var(--purple-500);
}

.showcase-3 > .content .btn.btn-previous {
  top: calc(50% - 16px);
  left: -16px;
}

.showcase-3 > .content .btn.btn-next {
  top: calc(50% - 16px);
  right: -16px;
}

.partner-item {
  display: inline-block;
  height: 120px;
  width: 200px;
}

.partner-item + .partner-item {
  margin-left: 100px;
}

.partner-item-image {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.asset-item {
  padding: 4px;
  border: 1px solid #efefef;
  border-radius: 4px;
}

.asset-item-title {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1;
  font-weight: 500;
  padding-top: 14px;
  padding-bottom: 14px;
  text-align: center;
}

.asset-item-image-container {
  height: 220px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.showcase-4 > .content {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 20px;
  padding: 12px 0;
}

.showcase-4 > .content .vertical-divider {
  display: none;
}

.contact-container {
  padding: 24px 0;
}

.inner-box.email, .inner-box.cellphone {
  display: inline-block;
  margin: 30px 0 0 0;
  width: calc(50% - 63px);
}

.inner-box.email {
  margin-right: 15px;
}

.inner-box.cellphone {
  margin-left: 15px;
}

.inner-box {
  text-align: center;
  padding: 28px 24px;
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgb(0 0 0 / 12%);
}

.inner-box-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin: 0;
  color: #4a4d4e;
  font-size: 1.4rem;
  line-height: 1;
}

.inner-box-title > .icon {
  margin-right: 10px;
  color: var(--red-300);
}

.inner-box-content {
  padding: 6px 0;
  font-size: .9rem;
}

.inner-box.address > .inner-box-title > .icon {
  margin-right: 6px;
}

.contact-form-container {
  padding: 24px 0;
}

.contact-form .form-group {
  margin-left: 0;
  margin-right: 0;
}

.contact-form .form-group-button {
  flex-direction: row;
  justify-content: flex-end;
}

.form-group-button > .btn {
  padding: 8px 32px;
}

.footer {
  text-align: center;
  padding: 18px;
  background-color: var(--purple-400);
}

.footer > .socials > .link + .link {
  margin-left: 30px;
}

.footer > .socials > .link {
  color: #F4C7FF;
}

.footer > .socials > .link.facebook:hover {
  color: #2e6fe5;
}

.footer > .socials > .link.linkedin:hover {
  color: #0072cf;
}

.footer > .socials > .link.twitter:hover {
  color: #459cff;
}

.footer .icon {
  display: inline-flex;
}

.icon > svg {
  height: 28px;
  width: 28px;
}

.footer > .divider {
  border-bottom-color: #f4aaff99;
  margin-top: 14px;
  margin-bottom: 18px;
}

.footer > .copyright {
  color: #F4C7FF;
}

[data-ows="scale-in"] {
  --delay: 0ms;
  transition: all 0.5s ease;
  transform: translateY(20px) scale(0.1);
  opacity: 0;
}

[data-ows="scale-in"].active {
  transition-delay: var(--delay);
  transform: translateY(0) scale(1);
  opacity: 1;
}

[data-ows="slide-right"] {
  transition: all 0.6s ease;
  transform: translateX(100%);
  opacity: 0;
}

[data-ows="slide-left"] {
  transition: all 0.6s ease;
  transform: translateX(-100%);
  opacity: 0;
}

[data-ows="slide-right"].active,
[data-ows="slide-left"].active {
  transform: translateX(0);
  opacity: 1;
}

@media (min-width: 576px) {
  .main > .content:first-child {
    padding: 0 80px;
  }

  .showcase-1, .showcase-2, .showcase-3, .showcase-4 {
    padding: 14px 60px; /* responsive */
  }
}

@media (min-width: 768px) {
  .navbar {
    padding-left: 90px;
    padding-right: 90px;
  }
  .main > .content:first-child {
    padding: 0 160px;
    height: 380px;
  }

  .main > .content:first-child > .description-container {
    padding: 40px 0;
  }

  .main > .content:first-child > .action-container {
    padding: 12px 0;
  }

  .showcase-1, .showcase-2, .showcase-3, .showcase-4 {
    padding: 18px 120px; /* responsive */
  }
}

@media (min-width: 992px) {
  .navbar {
    padding-left: 160px;
    padding-right: 160px;
  }

  .main > .content:first-child {
    float: left;
    width: 540px;
    height: 455px;
    padding: 0 290px 25px 200px;
    clip-path: ellipse(80% 106% at 20% -10%);
  }

  .main > .content:last-child {
    display: block;
  }

  .showcase-1, .showcase-2, .showcase-3, .showcase-4 {
    padding: 18px 180px;
  }

  .showcase-1 > .content {
    column-count: 2;
    column-gap: 120px;
    padding: 0 18px;
  }
}

@media (min-width: 1240px) {
  .showcase-1, .showcase-2, .showcase-3, .showcase-4 {
    padding: 20px 220px; /* responsive */
  }

  .showcase-4 > .content {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    grid-column-gap: 30px;
    grid-row-gap: 0;
    padding: 12px 0;
  }

  .showcase-4 > .content .vertical-divider {
    display: block;
  }
}

</style>
