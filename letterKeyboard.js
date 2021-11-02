const transparentElement = document.querySelector(".transparent-element")


const Keyboard = {
  elements: {
    main: null,
    writeConteiner: null,
    keysContainer: null,
    keys: [],
    lastPos: 0,
    allWindow :null
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    Shift: false,
    languageEn: true,
    cursorPositions: {
      start: 0,
      end: 0,
    },
    keyBoard: false,
  },

  init() {
    // Create main elements
    this.elements.allWindow = document.createElement("div");
    this.elements.main = document.createElement("div");
    this.elements.writeConteiner = document.createElement("input");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.writeConteiner.classList.add("letterKeyboardInput");
    this.elements.main.classList.add("letterKeyboard", "letterKeyboard--hidden");
    this.elements.keysContainer.classList.add("letterKeyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());


    this.elements.allWindow.classList.add("windowLetterKeyboard");
    document.querySelector("body").appendChild(this.elements.allWindow);

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".letterKeyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.writeConteiner);
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-letterKeyboard-input").forEach((element) => {
      element.addEventListener("click", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });

    const textArea = document.querySelector(".use-letterKeyboard-input, i");
    textArea.oninput = () => {
      keyboard.properties.value = textArea.value;
    };
  },

  _Pointer() {
    this.elements.lastPos = document.querySelector(".use-letterKeyboard-input").selectionStart;
    document.querySelector(".letterKeyboardInput").selectionStart = document.querySelector(".use-letterKeyboard-input").selectionStart;;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const keyLayoutEn = [
      "`","1","2","3","4","5","6","7","8","9","0","-","=","backspace",
      "q","w","e","r","t","y","u","i","o","p","[","]","\\","EN",
      "a","s","d", "f","g","h","j","k","l",";","'","del",
      "Shift","z","x","c","v","b","n","m",",",".","/","enter",
      "ArrowLeft","space","ArrowRight","done"
    ];

    const keyLayoutEnShift = [ 
      "~","!","@","#","$","%","^","&","*","(",")","_","+","backspace",
      "Q","W","E","R","T","Y","U","I","O","P","{","}","|","EN",
      "A","S","D","F","G","H","J","K","L",":",'"',"del",
      "Shift","Z","X","C","V","B","N","M","<",">","?","enter",
      "ArrowLeft","space","ArrowRight","done"
    ];

    const keyLayoutRu = [
      "ё","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","\\","RU",
      "ф","ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "del",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б","ю",".","enter",
      "ArrowLeft","space","ArrowRight","done"
    ];

    const keyLayoutRuShift = [ 
      "Ё","!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З","Х","Ъ","/","RU",
      "Ф","Ы", "В", "А", "П", "Р", "О", "Л", "Д","Ж","Э", "del",
      "Shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б","Ю",",","enter",
      "ArrowLeft","space","ArrowRight","done"
    ];

    let keyLayoutLang;
    let keyLayout;
    if(this.properties.languageEn){
      keyLayoutLang = [keyLayoutEn, keyLayoutEnShift];
    } else {
      keyLayoutLang = [keyLayoutRu, keyLayoutRuShift];
    }
   

    if (this.properties.Shift == true) {
      keyLayout = keyLayoutLang[1];
    } else {
      keyLayout = keyLayoutLang[0];
    }

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace","RU", "EN","enter", "done", "del"].indexOf(key) !== -1;
      const currentPos = this.properties.cursorPositions;
      const textArea = document.querySelector(".use-letterKeyboard-input");
      document.querySelector(".use-letterKeyboard-input").focus();
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("letterKeyboard__key");



      switch (key) {
        
        case "backspace":
          keyElement.classList.add("letterKeyboard__key--wide");
          keyElement.innerHTML = "Backspace";
          document.querySelector(".use-letterKeyboard-input").focus();

          keyElement.addEventListener("click", () => {
            let str1 = this.properties.value.substring(0,this.properties.cursorPositions.start - 1);
            let str2 = this.properties.value.substring(this.properties.cursorPositions.start,this.properties.value.length);

            this.properties.value = this.properties.value.length !== 1 ? str1 + str2 : "";
            this._triggerEvent("oninput");
            this._Focus("backspace");
          });

          break;

        case "del" :{
            keyElement.classList.add("letterKeyboard__key--wide");
            keyElement.innerHTML = "Del";
            document.querySelector(".use-letterKeyboard-input").focus();

            keyElement.addEventListener("click", () => {
              this.properties.value = "";
              this._triggerEvent("oninput");
              this._Focus("del");
            });


        }

        break;

        case 'EN':
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML ="EN";
          document.querySelector(".use-letterKeyboard-input").focus();
          keyElement.addEventListener('click', () => {
            this.properties.languageEn = false
            
             document.querySelectorAll('.letterKeyboard__key').forEach(el => el.remove());
             document.querySelectorAll('br').forEach(el => el.remove());
             this.elements.keysContainer.appendChild(this._createKeys());
          });
          break;

        case 'RU':
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = "RU";
          document.querySelector(".use-letterKeyboard-input").focus();
          keyElement.addEventListener('click', () => {

            this.properties.languageEn = true
             document.querySelectorAll('.letterKeyboard__key').forEach(el => el.remove());
             document.querySelectorAll('br').forEach(el => el.remove());
    
             this.elements.keysContainer.appendChild(this._createKeys());
          });
        break;

        case "Shift":
          keyElement.classList.add(
            "letterKeyboard__key--wide",
            "letterKeyboard__key--activatableCheck"
          );
          keyElement.innerHTML = "Shift";
          document.querySelector(".use-letterKeyboard-input").focus();

          if(this.properties.Shift){
            keyElement.classList.remove("letterKeyboard__key--disActivatable")
            keyElement.classList.add("letterKeyboard__key--activatable")
            // activatable.style.background ="green"
          } else {
            keyElement.classList.add("letterKeyboard__key--disActivatable")
            keyElement.classList.remove("letterKeyboard__key--activatable")
          }

          keyElement.addEventListener("click", () => {
            document.querySelector(".use-letterKeyboard-input").focus();
            this._toggleShift(keyElement);
          });

          break;

        case "space":
          keyElement.classList.add("letterKeyboard__key--extra-wide");
          keyElement.innerHTML = "Space";
          document.querySelector(".use-letterKeyboard-input").focus();

          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;

          keyElement.addEventListener("click", () => {
            let str1 = this.properties.value.substring(0,this.properties.cursorPositions.start);
            let str2 = this.properties.value.substring(this.properties.cursorPositions.start,this.properties.value.length);
            this.properties.value = str1 + " " + str2;
            this._triggerEvent("oninput");
            this._Focus("space");
          });

          break;

        case "done":
          keyElement.classList.add(
            "letterKeyboard__key--wide",
            "letterKeyboard__key--dark"
          );
          keyElement.innerHTML = "Done";

          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

          case "enter":
            keyElement.classList.add(
              "letterKeyboard__key--wide",
              "letterKeyboard__key--dark"
            );
            keyElement.innerHTML = "Enter";
  
            currentPos.start = textArea.selectionStart + 1;
            currentPos.end = textArea.selectionEnd + 1;
  
            keyElement.addEventListener("click", () => {
              this.properties.value += "\n";
              this._triggerEvent("oninput");
              this._Focus("enter");
            });
  
            break;
        case "ArrowLeft":
          keyElement.classList.add("letterKeyboard__key--wide");
          keyElement.innerHTML = "&#129040;";
          document.querySelector(".use-letterKeyboard-input").focus();

          keyElement.addEventListener("click", () => {
            this._Focus("left");
          });

          break;

        case "ArrowRight":
          keyElement.classList.add("letterKeyboard__key--wide");
          keyElement.innerHTML = "&#129042;";
          document.querySelector(".use-letterKeyboard-input").focus();

          keyElement.addEventListener("click", () => {
            this._Focus("right");
          });

          break;

        default:
          document
            .querySelector(".use-letterKeyboard-input")
            .addEventListener("keydown", function (event) {
              if (key[0] === event.keyCode) {
                keyElement.classList.add("letterKeyboard__key--active-button");
              }
            });
          document
            .querySelector(".use-letterKeyboard-input")
            .addEventListener("keyup", function (event) {
              if (key[0] === event.keyCode) {
                keyElement.classList.remove("letterKeyboard__key--active-button");
              }
            });

        keyElement.textContent = key

          keyElement.addEventListener("click", () => {
            let str1 = this.properties.value.substring(0,this.properties.cursorPositions.start);
            let str2 = this.properties.value.substring(this.properties.cursorPositions.start,this.properties.value.length);
            this.properties.value = str1 + key + str2;
            
            this._triggerEvent("oninput");
            this._Focus("add");
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }

 
    });
    return fragment;
  },

  
  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
    
  },

  _toggleShift(keyElement) {
    this.properties.Shift = !this.properties.Shift;

    document.querySelectorAll(".letterKeyboard__key").forEach((el) => el.remove());
    document.querySelectorAll("br").forEach((el) => el.remove());
    this.elements.keysContainer.appendChild(this._createKeys());




  },
  _Focus(type) {
    const textArea = document.querySelector(".use-letterKeyboard-input");
    const keyboardInput =  document.querySelector(".letterKeyboardInput");
    const currentPos = this.properties.cursorPositions;
    keyboardInput.value = textArea.value


    keyboardInput.focus();

    if (type === "add" || type === "space" || type === "enter") {
      textArea.selectionStart = currentPos.start + 1;
      textArea.selectionEnd = currentPos.end + 1;

      keyboardInput.selectionStart = currentPos.start + 1;
      keyboardInput.selectionEnd = currentPos.end + 1;
      this.properties.cursorPositions.start = this.properties.cursorPositions.start + 1;
      this.properties.cursorPositions.end = this.properties.cursorPositions.end + 1;
    } else if (type === "backspace") {
      let str1 = this.properties.value.substring(0,this.properties.cursorPositions.start-1);
      if(!str1){
        currentPos.start = this.properties.value.length + 1
        currentPos.end = this.properties.value.length + 1
      }
      textArea.selectionStart = (currentPos.start !== 0) ? currentPos.start - 1 : 0;
      textArea.selectionEnd = (currentPos.end  !== 0) ? currentPos.end  - 1 : 0;

      keyboardInput.selectionStart = (currentPos.start !== 0) ? currentPos.start - 1 : 0;
      keyboardInput.selectionEnd = (currentPos.end  !== 0) ? currentPos.end  - 1 : 0;

      this.properties.cursorPositions.start = (this.properties.cursorPositions.start !== 0) ? this.properties.cursorPositions.start - 1 : 0;
      this.properties.cursorPositions.end = (this.properties.cursorPositions.end !== 0) ? this.properties.cursorPositions.end - 1 :0;

    } else if (type === "left") {
      textArea.selectionStart = currentPos.start - 1;
      textArea.selectionEnd = currentPos.end - 1;

      keyboardInput.selectionStart = currentPos.start - 1;
      keyboardInput.selectionEnd = currentPos.end - 1;

      this.properties.cursorPositions.start = textArea.selectionStart;
      this.properties.cursorPositions.end = textArea.selectionEnd;
    } else if (type === "right") {
      textArea.selectionStart = currentPos.start + 1;
      textArea.selectionEnd = currentPos.end + 1;

      keyboardInput.selectionStart = currentPos.start + 1;
      keyboardInput.selectionEnd = currentPos.end + 1;

      this.properties.cursorPositions.start = textArea.selectionStart;
      this.properties.cursorPositions.end = textArea.selectionEnd;
    } else if(type ="del") {
      currentPos.start = 0
      currentPos.end = 0
      textArea.selectionStart = currentPos.start
      textArea.selectionEnd = currentPos.start

      keyboardInput.selectionStart = currentPos.start
      keyboardInput.selectionEnd = currentPos.start

      this.properties.cursorPositions.start = textArea.selectionStart;
      this.properties.cursorPositions.end = textArea.selectionEnd;
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("letterKeyboard--hidden");
    document.querySelector(".letterKeyboardInput").value = initialValue
    this.properties.cursorPositions.start = this.properties.value.length
    this.properties.cursorPositions.end = this.properties.value.length

  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("letterKeyboard--hidden");

  },
};

window.addEventListener("DOMContentLoaded", function () {
  const keyboard = document.querySelectorAll(".letterKeyboard")
  if(keyboard){keyboard.forEach(el => el.remove())}
  Keyboard.init();
});
