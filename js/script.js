const displayPrice = document.querySelector(".display_price");
const newsFeed = document.querySelector(".news_feed");

class PriceDisplay{
  constructor(...props){
    const container = document.createElement("div");
    container.classList = "price_container";
    displayPrice.appendChild(container);
  }
}

class Bitcoin{
  constructor(){
    this.setDefaultCountries();
    this.getPrices();
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
      {index: 0, code: "BTC"},
      {index: 1, code: "BCH"},
      {index: 2, code: "USD"},
      {index: 3, code: "EUR"},
      {index: 4, code: "GBP"},
      {index: 5, code: "JPY"},
      {index: 6, code: "CAD"},
    ]
  }

  setPrices(){
    this.countries.forEach(country => {
      new PriceDisplay(country, this.prices[country.index]);
    });
  }
}

const bitcoin = new Bitcoin();