const displayPrice = document.querySelector(".display_price");
const newsFeed = document.querySelector(".news_feed");
const API_KEY = "f3333d196ace41c09c7daf90e5ca10bd";

class PriceDisplay{
  constructor(country){
    //main container
    const container = document.createElement("div");
    container.classList = "price_container"
    //flag container 
    const flagContainer = document.createElement("div");
    const flagImg = document.createElement("img");
    flagContainer.classList = "flag_container";
    flagContainer.appendChild(flagImg);
    container.appendChild(flagContainer);
    //price container
    const priceContainer = document.createElement("div");
    const priceLabel = document.createElement("div");
    const price = document.createElement("div");
    priceLabel.textContent = `${country.name}`;
    price.textContent = `${country.rate.toFixed(2)}`;
    priceContainer.appendChild(priceLabel);
    priceContainer.appendChild(price);
    container.appendChild(priceContainer);
    //change Container
    const changeContainer = document.createElement("div");
    const changeLabel = document.createElement("div");
    const change = document.createElement("div");
    changeLabel.textContent = "Change %";
    change.textContent = (localStorage.getItem(country.code) === null) ? "0.00%" :  ((((country.rate) - (JSON.parse(localStorage.getItem(country.code)).rate))/(JSON.parse(localStorage.getItem(country.code)).rate)) *100).toFixed(2);
    changeContainer.appendChild(changeLabel);
    changeContainer.appendChild(change);
    container.appendChild(changeContainer);

    displayPrice.appendChild(container);

    localStorage[country.code] = JSON.stringify(country);

    fetch(`http://api.techlaunch.io:89/flags/${country.code}`)
      .then(res => res.json())
      .then(data => {
        flagImg.src = data.icon;
      })
      .catch(error => {
        console.error("There was an issue grabbing flag");
        console.log(error);
      })
  }
}

class NewsDisplay{
  constructor(story){
    //main container
    const container = document.createElement("div");
    container.classList = "news_container";
    //image
    const img = document.createElement("img");
    img.src = story.urlToImage;
    container.appendChild(img);
    //title
    const titleContainer = document.createElement("div");
    const title = document.createElement("a");
    title.href = story.url;
    title.textContent = story.title;
    titleContainer.appendChild(title);
    container.appendChild(titleContainer);
    //description
    const descriptionContainer = document.createElement("div");
    // const description = document.createElement("p");
    descriptionContainer.classList = "news_desc";
    descriptionContainer.textContent = this.truncateDescription(story.description);
    // descriptionContainer.appendChild(description);
    container.appendChild(descriptionContainer);
    //footer
    const footer = document.createElement("div");
    const author = document.createElement("span");
    const source = document.createElement("span");
    footer.classList = "news_footer";
    author.textContent = story.author;
    source.textContent = story.source.name;
    footer.appendChild(source);
    footer.appendChild(author);
    container.appendChild(footer);

    newsFeed.appendChild(container);
  }

  truncateDescription(desc){
    return (desc.length > 200) ? desc.substring(0, 201)+"..." : desc; 
  }
}

class Bitcoin{
  constructor(){
    this.setDefaultCountries();
    this.getPrices();
    this.indexes = 6;
    this.getNewsStories();
  }

  getPrices(){
    fetch('https://bitpay.com/api/rates')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.prices = data;
        this.setPrices();
      });
  }

  setDefaultCountries(){
    this.countries = [
      {index: 1, code: "BCH"},
      {index: 2, code: "USD"},
      {index: 3, code: "EUR"},
      {index: 4, code: "GBP"},
      {index: 5, code: "JPY"},
      {index: 6, code: "CAD"},
    ]
  }

  setPrices(){
    displayPrice.innerHTML = "";
    this.countries.forEach(country => {
      new PriceDisplay(this.prices[country.index]);
    });
    const button_container = document.createElement("div");
    const new_country = document.createElement("a");
    const remove_country = document.createElement("a");
    new_country.classList = "new_country";
    remove_country.classList = "new_country";
    new_country.textContent = "Add New Country";
    remove_country.textContent = "Remove a Country";
    new_country.addEventListener("click", e => { return this.addCountry(); });
    remove_country.addEventListener("click", e => { return this.removeCountry();});
    button_container.appendChild(new_country);
    button_container.appendChild(remove_country);
    displayPrice.appendChild(button_container);
  }

  addCountry(){
    const search = window.prompt("Which currency are you looking for? Please use the currency code for the country.");
    this.prices.forEach((country, index) => {
      if(country.code === search.toUpperCase()){
        this.countries.push(
          {index, code: country.code}
        )
      }
    });
    return this.setPrices();
  }

  removeCountry(){
    const search = window.prompt("Which currency would you like to remove? Pleas use the currency code for the country.")
    this.countries.forEach((country, index) => {
      if(country.code === search.toUpperCase()){
        this.countries = [...this.countries.slice(0, index), ...this.countries.slice(index+1)]
      }
    });
    return this.setPrices();
  }

  getNewsStories(){
    const today = `${new Date().getFullYear()}-${(new Date().getMonth)}-${new Date().getDate()}`
    fetch(`https://newsapi.org/v2/everything?q=bitcoin&from=${today}&sortBy=publishedAt&apiKey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        this.stories = data.articles;
        this.addNewsStories(this.indexes);
        
      });
  }

  addNewsStories(limit){
    if(this.indexes === 20) return;
    for(let i=limit-6; i<limit; i++){
      new NewsDisplay(this.stories[i]);
    }
    newsFeed.innerHTML += `
      <div class="ad">
        <div class="advertisement">Space for Advertisement</div>
      </div>
    `
  }

  incrementIndexes(){
    this.indexes = (this.indexes >=20) ? 20 : this.indexes + 6;
  }
}

const bitcoin = new Bitcoin();

window.addEventListener("scroll", e => {
    if(document.body.offsetHeight - window.scrollY <= window.innerHeight){
    bitcoin.incrementIndexes();
    bitcoin.addNewsStories(bitcoin.indexes);
  }
})