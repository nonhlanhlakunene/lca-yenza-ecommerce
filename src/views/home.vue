<script setup>
import services from '../assets/services2.png'
</script>

<template>
    <div class="home-container">
        <div class="home-hero-section">
            <div class="home-text">
                <h1 class="home-heading">YENZA!</h1>
                <p>Need a helping hand?</p><br>
                <p> 
                    Find trusted professionals for all your home and maintenance needs.
                    From plumbing and painting to gardening, carpentry, and more — 
                    get the job done by skilled workers you can rely on. <br><br>
                    Don't spend hours looking for someone you can trust. Find the right professional, 
                    book your service, and let the experts handle the rest <br><br>
                    Find Your Professional → <button class="service-link">service</button>
                </p>
            </div>

            <div class="home-services">
                <img :src="services" alt="Services">
            </div>
        </div>
        

        <div class="home-third-section">
            <h2>Why choose <span class="special-font">YENZA!</span></h2>

            <div class="home-boxes">
                <div class="box">
                    <h3>Trusted Professionals</h3>
                    <p>Professionals you can rely on</p>
                </div>
                <hr>
                <div class="box">
                    <h3>Quick & Easy</h3>
                    <p>Find someone without waiting hours searching</p>
                </div>
                <hr>
                <div class="box">
                    <h3>Transparent Pricing</h3>
                    <p>Know what you're paying for</p>
                </div>
            </div>
        </div>
        <hr class="customhrline">
        <div class="home-fourth-section">
            <div class="home-boxes">
                <div class="box">
                    <h2>500+ <br>Professionals</h2>
                </div>
                <div class="box">
                    <h2>1,200+ <br>Jobs completed</h2>
                </div>
                <div class="box">
                    <h2>4.8/5 <br>Average rating</h2>
                </div>
            </div>
        </div>
        <div class="home-reviews">
            <h2>Don't just take our word for it</h2>

            <div class="home-boxes">
                <div class="boxes">
                    <h3>reviews</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam vel iure temporibus voluptatem fugiat. Voluptate minus, voluptatem nihil quam amet voluptatibus corporis libero praesentium! Illum, cupiditate. Ipsam aliquam, libero illum esse dignissimos praesentium molestiae ducimus aliquid deserunt non, sapiente corporis eius natus alias? Quod, cupiditate reprehenderit magnam doloribus adipisci culpa.</p>
                </div>
                <div class="boxes">
                    <h3>reviews</h3>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. At mollitia voluptatem nulla iusto fugiat omnis unde esse quisquam odit nemo, rem deserunt voluptatibus dignissimos sequi doloribus nam labore et reiciendis eligendi laboriosam fuga consectetur culpa. Reiciendis voluptate alias deleniti asperiores sequi illum officia velit, quasi facilis totam eum itaque pariatur.</p>
                </div>
                <div class="boxes">
                    <h3>reviews</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero est voluptatem, omnis laboriosam, vero possimus dolorum, quia mollitia nobis labore iusto nesciunt tenetur itaque! Libero rerum explicabo voluptatibus odio laborum laboriosam quod eius adipisci a. Totam atque, reiciendis veritatis quam incidunt sapiente distinctio necessitatibus ex, nihil soluta sed, recusandae nisi!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

@import url('https://db.onlinewebfonts.com/c/2da952d097bffd198ec0f0aa3fdd6804?family=JejuHallasan');



* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.home-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

/* Navbar */



/* ========================= */

.home-heading {
    font-family: "JejuHallasan", sans-serif;
    color: white;
    font-size: 100px;
    font-weight: 800;
    margin-bottom: 25px;
}

.special-font{
    font-size: 50px;
    font-family: "JejuHallasan", sans-serif;
}

.home-text {
  height: 600px;
  padding: 50px;
  color: white;
  background: #136163;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  flex-direction: column;
}

.home-text p{
  max-width: 550px;
  font-size: 18px;
  line-height: 1.7;
  word-spacing: 10%;
}

.home-services {
    width: 70%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
}

.home-services img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.home-hero-section {
    width: 100%;
    height: 600px;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
}



@media (max-width: 1024px) {

    .home-container {
        height: auto;
    }

    .home-hero-section {
        flex-direction: column;
        height: auto;
    }

    .home-text {
        width: 100%;
        height: auto;
        min-height: 400px;
        padding: 40px;
    }

    .home-heading {
        font-size: 80px;
    }

    .home-text p {
        max-width: 100%;
        font-size: 17px;
    }

    .home-services {
        width: 100%;
        height: 500px;
    }

    .home-services img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
@media (max-width: 768px) {
    .home-text {
        min-height: 400px;
        padding: 35px 25px;
    }

    .home-heading {
        font-size: 65px;
        margin-bottom: 20px;
    }

    .home-text p {
        font-size: 16px;
        line-height: 1.6;
    }

    .home-services {
        height: 400px;
    }
}

@media (max-width: 480px) {

    .home-text {
        min-height: 350px;
        padding: 30px 20px;
    }

    .home-heading {
        font-size: 55px;
    }

    .home-text p {
        font-size: 15px;
        line-height: 1.5;
    }

    .home-services {
        height: 220px;
    }

    .home-services img {
        height: 220px;
        object-fit: cover;
    }
}





/* Home second section */


.home-second-section {
    width: 100%;
    padding: 60px 50px;
    flex-shrink: 0;
}

.home-second-section h4{
    color: #136163;
    margin-bottom: 15px;
    font-size: 25px;
}

.home-second-section p{
    word-spacing: 5%;
    /* max-width: 700px; */
    font-weight: 600;
    font-size: 20px;
    line-height: 1.7;
}

.service-link{
    background: #136163;
    color: white;
    border: none;
    font-weight: 600;
    font-size: 20px;
    text-decoration: underline;
    margin-left: 15px;
    cursor: pointer;
}

.service-link:hover{
    color: #bfcacb;
}


@media (max-width: 1024px) {
    .home-second-section {
        padding: 50px 40px;
    }

    .home-second-section h4 {
        font-size: 23px;
    }

    .home-second-section p {
        max-width: 650px;
        font-size: 16px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 16px;
    }
}

@media (max-width: 768px) {
    .home-second-section {
        padding: 45px 25px;
    }

    .home-second-section h4 {
        font-size: 21px;
        margin-bottom: 12px;
    }

    .home-second-section p {
        max-width: 100%;
        font-size: 15px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 15px;
        margin-left: 8px;
    }
}

@media (max-width: 480px) {
    .home-second-section {
        padding: 35px 20px;
    }

    .home-second-section h4 {
        font-size: 20px;
        line-height: 1.3;
    }

    .home-second-section p {
        font-size: 14px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 14px;
        margin-left: 5px;
    }
}






/* Third section */



.home-third-section {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}

.home-third-section h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 40px 0;
}

.home-boxes {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
}

.box {
    flex: 1;
    min-height: 180px;
    padding: 30px;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.box h3 {
    margin: 0 0 15px 0;
    font-size: 21px;
}

.box p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
}

@media (max-width: 768px) {
    .home-third-section {
        padding: 45px 25px;
    }

    .home-third-section h2 {
        font-size: 28px;
    }

    .home-boxes {
        flex-direction: column;
        gap: 20px;
    }

    .box {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-third-section {
        padding: 35px 20px;
    }

    .home-third-section h2 {
        font-size: 25px;
    }

    .box {
        min-height: 140px;
        padding: 20px;
    }

    .box h3 {
        font-size: 18px;
    }

    .box p {
        font-size: 14px;
    }
} 







/* Home fourth section */


.customhrline{
    width: 100%;
    max-width: 90%;
    margin: 20px auto;
}


.home-fourth-section {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}

.home-fourth-section h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 40px 0;
}

.home-boxes {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
}

.box {
    flex: 1;
    min-height: 180px;
    padding: 30px;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* .box h2 {
    color: #136163;
    margin: 0 0 15px 0;
    font-size: 40px;
} */

.box p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
}

@media (max-width: 768px) {
    .home-fourth-section {
        padding: 45px 25px;
    }

    .home-fourth-section h2 {
        font-size: 28px;
    }

    .home-boxes {
        flex-direction: column;
        gap: 20px;
    }

    .box {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-fourth-section {
        padding: 35px 20px;
    }

    .home-fourth-section h2 {
        font-size: 25px;
    }

    .box {
        min-height: 140px;
        padding: 20px;
    }

    .box h2 {
        font-size: 25px;
    }
} 







/* Home reviews */



.home-reviews {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}

.home-reviews h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 40px 0;
}

.home-boxes {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
}

.boxes {
    background-color: rgb(232, 229, 229);
    flex: 1;
    min-height: 180px;
    padding: 30px;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.boxes h3 {
    margin: 0 0 15px 0;
    font-size: 21px;
}

.boxes p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
}

@media (max-width: 768px) {
    .home-reviews {
        padding: 45px 25px;
    }

    .home-reviews h2 {
        font-size: 28px;
    }

    .home-boxes {
        flex-direction: column;
        gap: 20px;
    }

    .boxes {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-reviews {
        padding: 35px 20px;
    }

    .home-reviews h2 {
        font-size: 25px;
    }

    .boxes {
        min-height: 140px;
        padding: 20px;
    }

    .boxes h3 {
        font-size: 18px;
    }

    .boxes p {
        font-size: 14px;
    }
} 





/* footer */



</style>