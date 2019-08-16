
      
const supportedCards = {
  visa, mastercard
};

const countries = [
  {
    code: "US",
    currency: "USD",
    currencyName: '',
    country: 'United States'
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: '',
    country: 'Nigeria'
  },
  {
    code: 'KE',
    currency: 'KES',
    currencyName: '',
    country: 'Kenya'
  },
  {
    code: 'UG',
    currency: 'UGX',
    currencyName: '',
    country: 'Uganda'
  },
  {
    code: 'RW',
    currency: 'RWF',
    currencyName: '',
    country: 'Rwanda'
  },
  {
    code: 'TZ',
    currency: 'TZS',
    currencyName: '',
    country: 'Tanzania'
  },
  {
    code: 'ZA',
    currency: 'ZAR',
    currencyName: '',
    country: 'South Africa'
  },
  {
    code: 'CM',
    currency: 'XAF',
    currencyName: '',
    country: 'Cameroon'
  },
  {
    code: 'GH',
    currency: 'GHS',
    currencyName: '',
    country: 'Ghana'
  }
]; 
const billHype = () => {
  const billDisplay = document.querySelector('.mdc-typography--headline4');
  if (!billDisplay) return;

  billDisplay.addEventListener('click', () => {
    const billSpan = document.querySelector("[data-bill]");
    if (billSpan &&
      appState.bill &&
      appState.billFormatted &&
      appState.billFormatted === billSpan.textContent) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(appState.billFormatted)
      );
    }
  });
}; 

const appState = {};
const formatAsMoney = (amount, buyerCountry) => {
 const findCountry = countries.find(value=> value.country ===    buyerCountry);
  if (findCountry){
      return amount.toLocaleString(`en-${findCountry.code}` , 
      {style:'currency', currency:findCountry.currency})
  }else{
      return amount.toLocaleString(en-US,{
          style: 'currency',
          currency: "USD"
      })
}
};

const flagIfInvalid = (field, isValid)=> {
  isValid ?
   field.classList.remove('is-invalid'):field.classList.add    				('is-invalid');
}; 
const expiryDateFormatIsValid = (field)=>{
  const rgx = new RegExp(/[0-9]\/[0-9]{2}$/);
  return rgx.test(field.value);
}
const detectCardType = (first4Digits) => {
   const uiElement = document.querySelector('[data-credit-card]');
   const uiCardLogo = document.querySelector('[data-card-type]');
   if (first4Digits[0]==4){
       uiElement.classList.remove('is-mastercard');
       uiElement.classList.add('is-visa');
       uiCardLogo.src = visa;
       return 'is-visa';
   }
   else if (first4Digits[0]==5){
       uiElement.classList.remove('is-visa');
       uiElement.classList.add('is-mastercard');
       uiCardLogo.src = mastercard;
       return 'is-mastercard';
   }
   else{
       return false;
   }
};
const validateCardExpiryDate = () => {
   const target = document.querySelector('[data-cc-info] input:nth-child(2)')
   const isValid= expiryDateFormatIsValid(target);
   const expMonth = target.value.split('/')[0];
   const expYear = `20${target.value.split('/')[1]}`;
   const userDate = new Date (`${expMonth}-01-${expYear}`);
   const result = isValid && userDate >= new Date() ? true : false;
       flagIfInvalid(target, result);
       return result;
   }

const validateCardHolderName = () => {
   const name = document.querySelector('#name');
   let isValid = /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/.test(name.value); 
  
       flagIfInvalid(name, isValid)
       return isValid;
  
};
const validateWithLuhn = (digits) => {
   if(digits.length !== 16)return false;
   let total = 0;
   for(i= 0; i< digits.length; i++){
       if (typeof(digits[i]) !== 'number')return false;
       if (i % 2 == 0){
           let double = digits[i] * 2;
           if (double > 9) double -=9
           total +=double;
       } else	{
           total += Number(digits[i]);
       }
   }
   return (total % 10 == 0)
}
const validateCardNumber =() =>{
   const digits = appState.cardDigits.flat();
   const isValidLuhn = validateWithLuhn(digits);
   const field = document.querySelector('[data-cc-digits]');
   flagIfInvalid (field, isValidLuhn);
   let validateMessage = '';
   if(isValidLuhn){
       validateMessage ='Valid Credit Card Number';
   }else{
       validateMessage ='Invalid Credit Card Number'
   }
   document.querySelector('[data-validate-message]').textContent = validateMessage;
   return isValidLuhn
};
const validatePayment =() =>{
   validateCardNumber()
   validateCardHolderName()
   validateCardExpiryDate()
}
const smartCursor = (event, fieldIndex, fields) =>{
   if (event.target.value.length === event.target.size){
       fields[fieldIndex + 1].focus();
   }
}
  
const smartInput =(event, fieldIndex, fields)=> {
   if(fields[fieldIndex].getAttribute('placeholder')==='----'||
   fields[fieldIndex].getAttribute('placeholder')==='MM/YY'){
       const keys = ['Backspace', 'Tab', 'Shift', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
       if(fields[fieldIndex].getAttribute('placeholder')=== '----')
   {
   if (!keys.includes(event.key)){
       event.preventDefault();
   }
   }
   if( fields[fieldIndex].getAttribute('placeholder')==='MM/YY'){
       if(!keys.includes(event.key) && event.key !=='/'){
           event.preventDefault();
       }
   }
  const input = parseInt(event.key);
  if(isNaN(input)){
      return false;
  }
  let thisField = fields[fieldIndex];
  if(thisField.value.length < thisField.getAttribute('size')){
      appState.cardDigits[fieldIndex][thisField.value.length] = input;
      thisField += input;
      if(fieldIndex === 0){
          const first4Digits = appState.cardDigits[0];
          detectCardType(first4Digits);
      } 
  }
  if (fieldIndex < 3){
      setTimeout(()=>{
          let textMask= '';
          let first4Digits = '';
          for(let i = 0; i < thisField.value.length; i++){
              textMask += '#';
          }
          thisField.value = textMask;
      }, 500);
  }
   }



const el = event.target;
let key = event.keyCode || event.which;
const digitP = /\d$/;
if(fieldIndex < 4){
if(digitP.test(event.key)){
   if(appState.cardDigits[fieldIndex] === undefined){
       appState.cardDigits[fieldIndex] = [];
       appState.cardDigits[fieldIndex].push(event.key);
       const digits = appState.cardDigits[0];
       console.log(digits);
       detectCardType(digits);
   }else {
       appState.cardDigits[fieldIndex].push(event.key)
   }
   if (fieldIndex <=2){
       let value =  event.target.value;
       if(value.length === 0){
           setTimeout(()=>{
               el.value = '$';
           },500);}
   }
   smartCursor(event, fieldIndex, fields);
}else if (key == 37 || key == 38 ||key == 39||key == 40||key == 8||key ==46||key ==9){
   return;
}else {
   event.preventDefault();
}
} 
}  

  
const enableSmartTyping =() => {
   const inputs = document.querySelectorAll('input')
   inputs.forEach((field, index, fields)=>{
       field.addEventListener('keydown',(event)=>{
           smartInput(event, index, fields)
       })
       field.addEventListener('keyup', (event)=>{
           smartInput(event,index, fields)
       })
   })
} 



const uiCanInteract = () => {
   document.querySelector('[data-cc-digits] input:nth-child(1)').focus();
   document.querySelector('button[data-pay-btn]').addEventListener('click', validatePayment)
   billHype()
   enableSmartTyping()
};
const displayCartTotal = ({results}) => {
   let [data] = results;
   let {itemsInCart, buyerCountry} = data;
   appState.items = itemsInCart;
   appState.country = buyerCountry;
   appState.bill = itemsInCart.reduce((acc,total)=>acc +(total.qty *  total.price),0);
appState.billFormatted = formatAsMoney(appState.bill, appState.country) 
document.querySelector('[data-bill]').textContent = appState.billFormatted;
appState.cardDigits =[];
appState.cardDigits[0] = [];
appState.cardDigits[1] = [];
appState.cardDigits[2] = [];
appState.cardDigits[3] = [];


uiCanInteract();
}; 

const fetchBill = () => {
  const apiHost = 'https://randomapi.com/api';
  const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
  const apiEndpoint = `${apiHost}/${apiKey}`;
  fetch (apiEndpoint)
  .then(response=> response.json())
  .then(data => displayCartTotal(data))
  .catch(error=> console.log(error))
  
  
};

const startApp = () => {
    fetchBill();
};

startApp(); 
