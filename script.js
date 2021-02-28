const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    lastPos: 0
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    Shift: false,
    languageEn: true,
    cursorPositions: {
      start: 0,
      end: 0
    },
    keyBoard: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });

    const textArea = document.querySelector('.use-keyboard-input, i');
    textArea.oninput = () => {
      keyboard.properties.value = textArea.value;
      };
  
  },

  _Pointer(){
    this.elements.lastPos = document.querySelector('.use-keyboard-input').selectionStart;
},

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const keyLayoutEn = [
      "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]","\\","EN",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",";","'", "enter",
      "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/","done",
      "ArrowLeft","space","ArrowRight"
  ];
  const keyLayoutRu = [
      "ё","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","\\","RU",
      "caps", "ф","ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б","ю",".","done",
      "ArrowLeft","space","ArrowRight"
  ];
  const keyLayoutEnShift = [
      "~","!", "@", "#", "$", "%", "^", "&", "*", "(", ")","_","+", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","{","}","|","EN",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",":",'"', "enter",
      "Shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?","done",
      "ArrowLeft","space","ArrowRight"
  ];
  const keyLayoutRuShift = [
      "ё","!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","/","RU",
      "caps", "ф","ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б","ю",",","done",
      "ArrowLeft","space","ArrowRight"
  ];

  let keyLayoutLang;
  let keyLayout;

  if (this.properties.languageEn == true) {
    keyLayoutLang = [keyLayoutEn, keyLayoutEnShift];
  } else {
    keyLayoutLang = [keyLayoutRu,keyLayoutRuShift];
  }


  if (this.properties.Shift == true) {
   keyLayout = keyLayoutLang[1];
  } else {
   keyLayout = keyLayoutLang[0];
  }

    // Creates HTML for an icon
    function createIconHTML(icon_name) {
      return `<i class="material-icons">${icon_name}</i>`;
    }
    
    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace","EN","RU","done", "enter", "ArrowRight"].indexOf(key) !== -1;
      const currentPos = this.properties.cursorPositions;
      const textArea = document.querySelector(".use-keyboard-input");
      document.querySelector('.use-keyboard-input').focus();
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");
  
      switch (key) {

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          document.querySelector('.use-keyboard-input').focus();

          currentPos.start = textArea.selectionStart;
          currentPos.end = textArea.selectionEnd;


          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
            this._Focus('backspace');
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          document.querySelector('.use-keyboard-input').focus();

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

          case "Shift":
            
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("arrow_upward");
            document.querySelector('.use-keyboard-input').focus();
            
  
            keyElement.addEventListener("click", () => {
              document.querySelector('.use-keyboard-input').focus();
              
              document.querySelectorAll('.keyboard__key').forEach(el => el.remove());
              document.querySelectorAll('br').forEach(el => el.remove());
              this.elements.keysContainer.appendChild(this._createKeys());
              this._toggleShift();
              
              keyElement.classList.toggle("keyboard__key--active", this.properties.Shift);
              
            });
          
            break;
  
        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          document.querySelector('.use-keyboard-input').focus();

          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;


          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
            this._Focus('enter');
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          document.querySelector('.use-keyboard-input').focus();

          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
            this._Focus('space');
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

          
          case 'EN':
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("EN");
            document.querySelector('.use-keyboard-input').focus();
            keyElement.addEventListener('click', () => {
              
               this.properties.languageEn = false;
               document.querySelectorAll('.keyboard__key').forEach(el => el.remove());
               document.querySelectorAll('br').forEach(el=>el.remove());
               this.elements.keysContainer.appendChild(this._createKeys());
            });
            break;

            case 'RU':
              keyElement.classList.add("keyboard__key--wide");
              keyElement.innerHTML = createIconHTML("RU");
              document.querySelector('.use-keyboard-input').focus();
              keyElement.addEventListener('click', () => {

                 this.properties.languageEn = true;
                 document.querySelectorAll('.keyboard__key').forEach(el => el.remove());
                 document.querySelectorAll('br').forEach(el=>el.remove());
        
                 this.elements.keysContainer.appendChild(this._createKeys());
              });
              break;
            
            case "ArrowLeft":
              keyElement.classList.add('keyboard__key--wide');
              keyElement.innerHTML = createIconHTML("arrow_back");
              document.querySelector('.use-keyboard-input').focus();

              keyElement.addEventListener('click', () => {
                  this._Focus('left');
              });
              
              break;

            case "ArrowRight":
             keyElement.classList.add('keyboard__key--wide');
             keyElement.innerHTML = createIconHTML("arrow_forward");
             document.querySelector('.use-keyboard-input').focus();

            keyElement.addEventListener('click', () => {
                  this._Focus('right');
             });

             break;


        default:

          document.querySelector(".use-keyboard-input").addEventListener('keydown', function(event) {
            if(key[0] === event.keyCode) {
              keyElement.classList.add("keyboard__key--active-button");
            }
          });
          document.querySelector(".use-keyboard-input").addEventListener('keyup', function(event) {
            if(key[0] === event.keyCode){
            keyElement.classList.remove("keyboard__key--active-button");
            }
          });

          keyElement.textContent = key.toLowerCase();
          currentPos.start = textArea.selectionStart + 1;
          currentPos.end = textArea.selectionEnd + 1;

          keyElement.addEventListener("click", () => {
            if (this.properties.capsLock && this.properties.Shift) {
              this.properties.value += key.toLowerCase()
            }
            else if (this.properties.capsLock || this.properties.Shift) {
              this.properties.value += key.toUpperCase()
            }
            else {
              this.properties.value +=  key.toLowerCase();
            }
            this._triggerEvent("oninput");
            this._Focus('add');
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

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) { 
      if (key.childElementCount === 0) {
      if (this.properties.capsLock && this.properties.Shift){
        key.textContent = key.textContent.toLowerCase();
      } else if (this.properties.capsLock || this.properties.Shift) {

        key.textContent = key.textContent.toUpperCase();
      } else {
        key.textContent = key.textContent.toLowerCase();
    }
    }
  }
  },

  _toggleShift() {
    this.properties.Shift = !this.properties.Shift;
   

    for (const key of this.elements.keys) { 
      if (key.childElementCount === 0) {
      if (this.properties.capsLock && this.properties.Shift) {
        key.textContent = key.textContent.toLowerCase();
      } else if (this.properties.capsLock || this.properties.Shift) {
        key.textContent = key.textContent.toUpperCase();
      } else {
        key.textContent = key.textContent.toLowerCase();
    }
    
    }
  }
  },
  _Focus(type) {
    const textArea = document.querySelector(".use-keyboard-input");
    const currentPos = this.properties.cursorPositions;

    textArea.focus();

    if (type === 'add' || type === 'space') {
      textArea.selectionStart = currentPos.start + 1;
      textArea.selectionEnd = currentPos.end + 1;
    } else if (type === 'backspace') {
      textArea.selectionStart = currentPos.start - 1;
      textArea.selectionEnd = currentPos.end - 1;
    } else if(type === 'enter') {
    } else if(type === 'left'){
      textArea.selectionStart = currentPos.start - 1;
      textArea.selectionEnd = currentPos.end - 1;
      this.properties.cursorPositions.start = textArea.selectionStart;
      this.properties.cursorPositions.end = textArea.selectionEnd;
    } else if(type === 'right'){
      textArea.selectionStart = currentPos.start + 1;
      textArea.selectionEnd = currentPos.end + 1;
      this.properties.cursorPositions.start = textArea.selectionStart;
      this.properties.cursorPositions.end = textArea.selectionEnd;
    }
  },

   


  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }



};




window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
function newFunction() {
  document.querySelector('.use-keyboard-input').addEventListener('click', () => {
    this._Pointer();
    this.open();
  });
}

