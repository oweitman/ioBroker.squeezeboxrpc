"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // squeezeboxrpc/myi18n/translations.json
  var require_translations = __commonJS({
    "squeezeboxrpc/myi18n/translations.json"(exports, module) {
      module.exports = {
        ainstance: { en: "SqueezeboxRPC instance", de: "SqueezeboxRPC-Instanz", ru: "\u042D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440 SqueezeboxRPC", pt: "Inst\xE2ncia SqueezeboxRPC", nl: "SqueezeboxRPC-instantie", fr: "Instance SqueezeboxRPC", it: "Istanza SqueezeboxRPC", es: "Instancia SqueezeboxRPC", pl: "Instancja SqueezeboxRPC", uk: "\u0415\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440 SqueezeboxRPC", "zh-cn": "SqueezeboxRPC \u5B9E\u4F8B" },
        viewindex: { en: "Viewindex", de: "Ansichtsindex", ru: "\u0418\u043D\u0434\u0435\u043A\u0441 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F", pt: "\xCDndice da vista", nl: "Weergave-index", fr: "Index de vue", it: "Indice vista", es: "\xCDndice de vista", pl: "Indeks widoku", uk: "\u0406\u043D\u0434\u0435\u043A\u0441 \u043F\u043E\u0434\u0430\u043D\u043D\u044F", "zh-cn": "\u89C6\u56FE\u7D22\u5F15" },
        wrapcamelcase: { en: "Wrap Camelcase", de: "CamelCase umbrechen", ru: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441 CamelCase", pt: "Quebrar CamelCase", nl: "CamelCase afbreken", fr: "Renvoyer CamelCase \xE0 la ligne", it: "A capo CamelCase", es: "Dividir CamelCase", pl: "Zawijaj CamelCase", uk: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0438 CamelCase", "zh-cn": "CamelCase \u6362\u884C" },
        buttonbkcolor: { en: "Button background color", de: "Schaltfl\xE4chen-Hintergrundfarbe", ru: "\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0438", pt: "Cor de fundo do bot\xE3o", nl: "Achtergrondkleur knop", fr: "Couleur d'arri\xE8re-plan du bouton", it: "Colore di sfondo del pulsante", es: "Color de fondo del bot\xF3n", pl: "Kolor t\u0142a przycisku", uk: "\u041A\u043E\u043B\u0456\u0440 \u0444\u043E\u043D\u0443 \u043A\u043D\u043E\u043F\u043A\u0438", "zh-cn": "\u6309\u94AE\u80CC\u666F\u989C\u8272" },
        widgetPlayer: { en: "Player widget", de: "Player-Widget", ru: "\u0412\u0438\u0434\u0436\u0435\u0442 \u043F\u0440\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0442\u0435\u043B\u044F", pt: "Widget do leitor", nl: "Spelerwidget", fr: "Widget du lecteur", it: "Widget del lettore", es: "Widget del reproductor", pl: "Wid\u017Cet odtwarzacza", uk: "\u0412\u0456\u0434\u0436\u0435\u0442 \u043F\u0440\u043E\u0433\u0440\u0430\u0432\u0430\u0447\u0430", "zh-cn": "\u64AD\u653E\u5668\u5C0F\u90E8\u4EF6" },
        widgetFavorites: { en: "Favorite widget", de: "Favoriten-Widget", ru: "\u0412\u0438\u0434\u0436\u0435\u0442 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E", pt: "Widget de favoritos", nl: "Favorietenwidget", fr: "Widget des favoris", it: "Widget dei preferiti", es: "Widget de favoritos", pl: "Wid\u017Cet ulubionych", uk: "\u0412\u0456\u0434\u0436\u0435\u0442 \u043E\u0431\u0440\u0430\u043D\u043E\u0433\u043E", "zh-cn": "\u6536\u85CF\u5939\u5C0F\u90E8\u4EF6" },
        picHeight: { en: "Button height", de: "Schaltfl\xE4chenh\xF6he", ru: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0438", pt: "Altura do bot\xE3o", nl: "Knophoogte", fr: "Hauteur du bouton", it: "Altezza del pulsante", es: "Altura del bot\xF3n", pl: "Wysoko\u015B\u0107 przycisku", uk: "\u0412\u0438\u0441\u043E\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0438", "zh-cn": "\u6309\u94AE\u9AD8\u5EA6" },
        picWidth: { en: "Button width", de: "Schaltfl\xE4chenbreite", ru: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0438", pt: "Largura do bot\xE3o", nl: "Knopbreedte", fr: "Largeur du bouton", it: "Larghezza del pulsante", es: "Anchura del bot\xF3n", pl: "Szeroko\u015B\u0107 przycisku", uk: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0438", "zh-cn": "\u6309\u94AE\u5BBD\u5EA6" },
        opacity: { en: "Opacity", de: "Deckkraft", ru: "\u041D\u0435\u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C", pt: "Opacidade", nl: "Dekking", fr: "Opacit\xE9", it: "Opacit\xE0", es: "Opacidad", pl: "Krycie", uk: "\u041D\u0435\u043F\u0440\u043E\u0437\u043E\u0440\u0456\u0441\u0442\u044C", "zh-cn": "\u4E0D\u900F\u660E\u5EA6" },
        editmodehelper: { en: "Edit Mode Helper", de: "Bearbeitungsmodus-Hilfe", ru: "\u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0440\u0435\u0436\u0438\u043C\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F", pt: "Auxiliar do modo de edi\xE7\xE3o", nl: "Hulp voor bewerkingsmodus", fr: "Assistant du mode \xE9dition", it: "Assistente modalit\xE0 modifica", es: "Ayuda del modo de edici\xF3n", pl: "Pomoc trybu edycji", uk: "\u041F\u043E\u043C\u0456\u0447\u043D\u0438\u043A \u0440\u0435\u0436\u0438\u043C\u0443 \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F", "zh-cn": "\u7F16\u8F91\u6A21\u5F0F\u52A9\u624B" },
        group_buttonsettings: { en: "Button options", de: "Schaltfl\xE4chenoptionen", ru: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u043A\u043D\u043E\u043F\u043E\u043A", pt: "Op\xE7\xF5es dos bot\xF5es", nl: "Knopopties", fr: "Options des boutons", it: "Opzioni dei pulsanti", es: "Opciones de botones", pl: "Opcje przycisk\xF3w", uk: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u043A\u043D\u043E\u043F\u043E\u043A", "zh-cn": "\u6309\u94AE\u9009\u9879" },
        borderwidth: { en: "Border width", de: "Rahmenbreite", ru: "\u0428\u0438\u0440\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438", pt: "Largura da borda", nl: "Randbreedte", fr: "Largeur de bordure", it: "Larghezza bordo", es: "Anchura del borde", pl: "Szeroko\u015B\u0107 obramowania", uk: "\u0428\u0438\u0440\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u5BBD\u5EA6" },
        borderstyle: { en: "Border-style", de: "Rahmenart", ru: "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438", pt: "Estilo da borda", nl: "Randstijl", fr: "Style de bordure", it: "Stile bordo", es: "Estilo del borde", pl: "Styl obramowania", uk: "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u6837\u5F0F" },
        bordercolornormal: { en: "Border width normal", de: "Rahmenfarbe normal", ru: "\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0446\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438", pt: "Cor normal da borda", nl: "Normale randkleur", fr: "Couleur de bordure normale", it: "Colore bordo normale", es: "Color normal del borde", pl: "Normalny kolor obramowania", uk: "\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439 \u043A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u666E\u901A\u8FB9\u6846\u989C\u8272" },
        bordercoloractive: { en: "Border width aktiv", de: "Rahmenfarbe aktiv", ru: "\u0426\u0432\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0440\u0430\u043C\u043A\u0438", pt: "Cor da borda ativa", nl: "Actieve randkleur", fr: "Couleur de bordure active", it: "Colore bordo attivo", es: "Color del borde activo", pl: "Kolor aktywnego obramowania", uk: "\u041A\u043E\u043B\u0456\u0440 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0457 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u6D3B\u52A8\u8FB9\u6846\u989C\u8272" },
        borderradius: { en: "border-radius", de: "Rahmenradius", ru: "\u0420\u0430\u0434\u0438\u0443\u0441 \u0440\u0430\u043C\u043A\u0438", pt: "Raio da borda", nl: "Randradius", fr: "Rayon de bordure", it: "Raggio bordo", es: "Radio del borde", pl: "Promie\u0144 obramowania", uk: "\u0420\u0430\u0434\u0456\u0443\u0441 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u5706\u89D2" },
        imagefwd: { en: "Picture", de: "Bild", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435", pt: "Imagem", nl: "Afbeelding", fr: "Image", it: "Immagine", es: "Imagen", pl: "Obraz", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F", "zh-cn": "\u56FE\u7247" },
        group_svgsettings: { en: "SVG Settings", de: "SVG-Einstellungen", ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 SVG", pt: "Defini\xE7\xF5es SVG", nl: "SVG-instellingen", fr: "Param\xE8tres SVG", it: "Impostazioni SVG", es: "Ajustes SVG", pl: "Ustawienia SVG", uk: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F SVG", "zh-cn": "SVG \u8BBE\u7F6E" },
        fillcolor: { en: "fillcolor", de: "F\xFCllfarbe", ru: "\u0426\u0432\u0435\u0442 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", pt: "Cor de preenchimento", nl: "Vulkleur", fr: "Couleur de remplissage", it: "Colore riempimento", es: "Color de relleno", pl: "Kolor wype\u0142nienia", uk: "\u041A\u043E\u043B\u0456\u0440 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", "zh-cn": "\u586B\u5145\u989C\u8272" },
        strokecolor: { en: "strokecolor", de: "Konturfarbe", ru: "\u0426\u0432\u0435\u0442 \u043A\u043E\u043D\u0442\u0443\u0440\u0430", pt: "Cor do contorno", nl: "Lijnkleur", fr: "Couleur du contour", it: "Colore contorno", es: "Color del trazo", pl: "Kolor obrysu", uk: "\u041A\u043E\u043B\u0456\u0440 \u043A\u043E\u043D\u0442\u0443\u0440\u0443", "zh-cn": "\u63CF\u8FB9\u989C\u8272" },
        strokewidth: { en: "strokewidth", de: "Konturbreite", ru: "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u043A\u043E\u043D\u0442\u0443\u0440\u0430", pt: "Largura do contorno", nl: "Lijndikte", fr: "Largeur du contour", it: "Spessore contorno", es: "Grosor del trazo", pl: "Szeroko\u015B\u0107 obrysu", uk: "\u0422\u043E\u0432\u0449\u0438\u043D\u0430 \u043A\u043E\u043D\u0442\u0443\u0440\u0443", "zh-cn": "\u63CF\u8FB9\u5BBD\u5EA6" },
        imagerew: { en: "Picture", de: "Bild", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435", pt: "Imagem", nl: "Afbeelding", fr: "Image", it: "Immagine", es: "Imagen", pl: "Obraz", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F", "zh-cn": "\u56FE\u7247" },
        imagepause: { en: "Picture pause", de: "Bild Pause", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0430\u0443\u0437\u044B", pt: "Imagem de pausa", nl: "Afbeelding pauze", fr: "Image de pause", it: "Immagine pausa", es: "Imagen de pausa", pl: "Obraz pauzy", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u0430\u0443\u0437\u0438", "zh-cn": "\u6682\u505C\u56FE\u7247" },
        imageplay: { en: "Picture play", de: "Bild Wiedergabe", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F", pt: "Imagem de reprodu\xE7\xE3o", nl: "Afbeelding afspelen", fr: "Image de lecture", it: "Immagine riproduzione", es: "Imagen de reproducci\xF3n", pl: "Obraz odtwarzania", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F", "zh-cn": "\u64AD\u653E\u56FE\u7247" },
        imagestop: { en: "Picture stop", de: "Bild Stopp", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438", pt: "Imagem de paragem", nl: "Afbeelding stoppen", fr: "Image d'arr\xEAt", it: "Immagine arresto", es: "Imagen de parada", pl: "Obraz zatrzymania", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0443\u043F\u0438\u043D\u043A\u0438", "zh-cn": "\u505C\u6B62\u56FE\u7247" },
        calctype: { en: "CalcType", de: "Berechnungsart", ru: "\u0422\u0438\u043F \u0440\u0430\u0441\u0447\u0451\u0442\u0430", pt: "Tipo de c\xE1lculo", nl: "Berekeningstype", fr: "Type de calcul", it: "Tipo di calcolo", es: "Tipo de c\xE1lculo", pl: "Typ obliczenia", uk: "\u0422\u0438\u043F \u043E\u0431\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044F", "zh-cn": "\u8BA1\u7B97\u7C7B\u578B" },
        segments: { en: "Segments", de: "Segmente", ru: "\u0421\u0435\u0433\u043C\u0435\u043D\u0442\u044B", pt: "Segmentos", nl: "Segmenten", fr: "Segments", it: "Segmenti", es: "Segmentos", pl: "Segmenty", uk: "\u0421\u0435\u0433\u043C\u0435\u043D\u0442\u0438", "zh-cn": "\u5206\u6BB5" },
        fillcolornormal: { en: "fillcolornormal", de: "Normale F\xFCllfarbe", ru: "\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0446\u0432\u0435\u0442 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", pt: "Cor de preenchimento normal", nl: "Normale vulkleur", fr: "Couleur de remplissage normale", it: "Colore riempimento normale", es: "Color de relleno normal", pl: "Normalny kolor wype\u0142nienia", uk: "\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439 \u043A\u043E\u043B\u0456\u0440 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", "zh-cn": "\u666E\u901A\u586B\u5145\u989C\u8272" },
        fillcoloractive: { en: "fillcoloractive", de: "Aktive F\xFCllfarbe", ru: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0446\u0432\u0435\u0442 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", pt: "Cor de preenchimento ativa", nl: "Actieve vulkleur", fr: "Couleur de remplissage active", it: "Colore riempimento attivo", es: "Color de relleno activo", pl: "Aktywny kolor wype\u0142nienia", uk: "\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439 \u043A\u043E\u043B\u0456\u0440 \u0437\u0430\u043B\u0438\u0432\u043A\u0438", "zh-cn": "\u6D3B\u52A8\u586B\u5145\u989C\u8272" },
        position: { en: "Format", de: "Format", ru: "\u0424\u043E\u0440\u043C\u0430\u0442", pt: "Formato", nl: "Indeling", fr: "Format", it: "Formato", es: "Formato", pl: "Format", uk: "\u0424\u043E\u0440\u043C\u0430\u0442", "zh-cn": "\u683C\u5F0F" },
        group_segmentsettings: { en: "Segments", de: "Segmente", ru: "\u0421\u0435\u0433\u043C\u0435\u043D\u0442\u044B", pt: "Segmentos", nl: "Segmenten", fr: "Segments", it: "Segmenti", es: "Segmentos", pl: "Segmenty", uk: "\u0421\u0435\u0433\u043C\u0435\u043D\u0442\u0438", "zh-cn": "\u5206\u6BB5" },
        margin: { en: "margin", de: "Abstand", ru: "\u041E\u0442\u0441\u0442\u0443\u043F", pt: "Margem", nl: "Marge", fr: "Marge", it: "Margine", es: "Margen", pl: "Margines", uk: "\u0412\u0456\u0434\u0441\u0442\u0443\u043F", "zh-cn": "\u5916\u8FB9\u8DDD" },
        imagerepeat0: { en: "Picture without", de: "Bild ohne Wiederholung", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0431\u0435\u0437 \u043F\u043E\u0432\u0442\u043E\u0440\u0430", pt: "Imagem sem repeti\xE7\xE3o", nl: "Afbeelding zonder herhaling", fr: "Image sans r\xE9p\xE9tition", it: "Immagine senza ripetizione", es: "Imagen sin repetici\xF3n", pl: "Obraz bez powtarzania", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0431\u0435\u0437 \u043F\u043E\u0432\u0442\u043E\u0440\u0443", "zh-cn": "\u4E0D\u91CD\u590D\u56FE\u7247" },
        imagerepeat1: { en: "Picture Title", de: "Bild Titel wiederholen", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0430 \u0442\u0440\u0435\u043A\u0430", pt: "Imagem de repeti\xE7\xE3o da faixa", nl: "Afbeelding titel herhalen", fr: "Image de r\xE9p\xE9tition du titre", it: "Immagine ripeti titolo", es: "Imagen de repetir t\xEDtulo", pl: "Obraz powtarzania utworu", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u0443 \u0442\u0440\u0435\u043A\u0443", "zh-cn": "\u91CD\u590D\u66F2\u76EE\u56FE\u7247" },
        imagerepeat2: { en: "Picture Playlist", de: "Bild Playlist wiederholen", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0430 \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442\u0430", pt: "Imagem de repeti\xE7\xE3o da lista", nl: "Afbeelding afspeellijst herhalen", fr: "Image de r\xE9p\xE9tition de la playlist", it: "Immagine ripeti playlist", es: "Imagen de repetir lista", pl: "Obraz powtarzania playlisty", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u0443 \u0441\u043F\u0438\u0441\u043A\u0443", "zh-cn": "\u91CD\u590D\u64AD\u653E\u5217\u8868\u56FE\u7247" },
        imageshuffle0: { en: "Picture without", de: "Bild ohne Zufallswiedergabe", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0431\u0435\u0437 \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u043D\u0438\u044F", pt: "Imagem sem reprodu\xE7\xE3o aleat\xF3ria", nl: "Afbeelding zonder willekeurig afspelen", fr: "Image sans lecture al\xE9atoire", it: "Immagine senza riproduzione casuale", es: "Imagen sin reproducci\xF3n aleatoria", pl: "Obraz bez odtwarzania losowego", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0431\u0435\u0437 \u043F\u0435\u0440\u0435\u043C\u0456\u0448\u0443\u0432\u0430\u043D\u043D\u044F", "zh-cn": "\u4E0D\u968F\u673A\u64AD\u653E\u56FE\u7247" },
        imageshuffle1: { en: "Picture Title", de: "Bild Titel zuf\xE4llig", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u043D\u0438\u044F \u0442\u0440\u0435\u043A\u043E\u0432", pt: "Imagem de faixas aleat\xF3rias", nl: "Afbeelding titels willekeurig", fr: "Image des titres al\xE9atoires", it: "Immagine titoli casuali", es: "Imagen de t\xEDtulos aleatorios", pl: "Obraz losowania utwor\xF3w", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u043C\u0456\u0448\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0440\u0435\u043A\u0456\u0432", "zh-cn": "\u968F\u673A\u66F2\u76EE\u56FE\u7247" },
        imageshuffle2: { en: "Picture Album", de: "Bild Album zuf\xE4llig", ru: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u043D\u0438\u044F \u0430\u043B\u044C\u0431\u043E\u043C\u043E\u0432", pt: "Imagem de \xE1lbuns aleat\xF3rios", nl: "Afbeelding albums willekeurig", fr: "Image des albums al\xE9atoires", it: "Immagine album casuali", es: "Imagen de \xE1lbumes aleatorios", pl: "Obraz losowania album\xF3w", uk: "\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u043C\u0456\u0448\u0443\u0432\u0430\u043D\u043D\u044F \u0430\u043B\u044C\u0431\u043E\u043C\u0456\u0432", "zh-cn": "\u968F\u673A\u4E13\u8F91\u56FE\u7247" },
        bordercolornogroup: { en: "Border color - No group", de: "Rahmenfarbe \u2013 Keine Gruppe", ru: "\u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0431\u0435\u0437 \u0433\u0440\u0443\u043F\u043F\u044B", pt: "Cor da borda \u2014 sem grupo", nl: "Randkleur \u2014 geen groep", fr: "Couleur de bordure \u2014 aucun groupe", it: "Colore bordo \u2014 nessun gruppo", es: "Color del borde \u2014 sin grupo", pl: "Kolor obramowania \u2014 brak grupy", uk: "\u041A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0431\u0435\u0437 \u0433\u0440\u0443\u043F\u0438", "zh-cn": "\u8FB9\u6846\u989C\u8272 \u2014 \u65E0\u7EC4" },
        bordercolorowngroup: { en: "Border color - Own group", de: "Rahmenfarbe \u2013 Eigene Gruppe", ru: "\u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0441\u0432\u043E\u044F \u0433\u0440\u0443\u043F\u043F\u0430", pt: "Cor da borda \u2014 grupo pr\xF3prio", nl: "Randkleur \u2014 eigen groep", fr: "Couleur de bordure \u2014 groupe propre", it: "Colore bordo \u2014 gruppo proprio", es: "Color del borde \u2014 grupo propio", pl: "Kolor obramowania \u2014 w\u0142asna grupa", uk: "\u041A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0432\u043B\u0430\u0441\u043D\u0430 \u0433\u0440\u0443\u043F\u0430", "zh-cn": "\u8FB9\u6846\u989C\u8272 \u2014 \u81EA\u5DF1\u7684\u7EC4" },
        bordercolorothergroup: { en: "Border color - Other group", de: "Rahmenfarbe \u2013 Andere Gruppe", ru: "\u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0434\u0440\u0443\u0433\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430", pt: "Cor da borda \u2014 outro grupo", nl: "Randkleur \u2014 andere groep", fr: "Couleur de bordure \u2014 autre groupe", it: "Colore bordo \u2014 altro gruppo", es: "Color del borde \u2014 otro grupo", pl: "Kolor obramowania \u2014 inna grupa", uk: "\u041A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438 \u2014 \u0456\u043D\u0448\u0430 \u0433\u0440\u0443\u043F\u0430", "zh-cn": "\u8FB9\u6846\u989C\u8272 \u2014 \u5176\u4ED6\u7EC4" },
        group_rowsettings: { en: "Row settings", de: "Zeilenkonfiguration", ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0442\u0440\u043E\u043A\u0438", pt: "Defini\xE7\xF5es da linha", nl: "Rij-instellingen", fr: "Param\xE8tres de ligne", it: "Impostazioni riga", es: "Ajustes de fila", pl: "Ustawienia wiersza", uk: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u044F\u0434\u043A\u0430", "zh-cn": "\u884C\u8BBE\u7F6E" },
        rowBackground: { en: "Row background color", de: "Hintergrundfarbe einer Zeile", ru: "\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0438", pt: "Cor de fundo da linha", nl: "Achtergrondkleur rij", fr: "Couleur d'arri\xE8re-plan de la ligne", it: "Colore di sfondo della riga", es: "Color de fondo de la fila", pl: "Kolor t\u0142a wiersza", uk: "\u041A\u043E\u043B\u0456\u0440 \u0444\u043E\u043D\u0443 \u0440\u044F\u0434\u043A\u0430", "zh-cn": "\u884C\u80CC\u666F\u989C\u8272" },
        activeRowBackground: { en: "Active row background color", de: "Hintergrundfarbe der aktiven Zeile", ru: "\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438", pt: "Cor de fundo da linha ativa", nl: "Achtergrondkleur actieve rij", fr: "Couleur d'arri\xE8re-plan de la ligne active", it: "Colore di sfondo della riga attiva", es: "Color de fondo de la fila activa", pl: "Kolor t\u0142a aktywnego wiersza", uk: "\u041A\u043E\u043B\u0456\u0440 \u0444\u043E\u043D\u0443 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0440\u044F\u0434\u043A\u0430", "zh-cn": "\u6D3B\u52A8\u884C\u80CC\u666F\u989C\u8272" },
        rowBorderColor: { en: "Border color", de: "Rahmenfarbe", ru: "\u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438", pt: "Cor da borda", nl: "Randkleur", fr: "Couleur de bordure", it: "Colore bordo", es: "Color del borde", pl: "Kolor obramowania", uk: "\u041A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u989C\u8272" },
        rowBorderWidth: { en: "Border width", de: "Rahmenbreite", ru: "\u0428\u0438\u0440\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438", pt: "Largura da borda", nl: "Randbreedte", fr: "Largeur de bordure", it: "Larghezza bordo", es: "Anchura del borde", pl: "Szeroko\u015B\u0107 obramowania", uk: "\u0428\u0438\u0440\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u5BBD\u5EA6" },
        rowBorderStyle: { en: "Border style", de: "Rahmenart", ru: "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438", pt: "Estilo da borda", nl: "Randstijl", fr: "Style de bordure", it: "Stile bordo", es: "Estilo del borde", pl: "Styl obramowania", uk: "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u6837\u5F0F" },
        rowSpacing: { en: "Spacing to next track", de: "Abstand zum n\xE4chsten Titel", ru: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0434\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0442\u0440\u0435\u043A\u0430", pt: "Espa\xE7o at\xE9 \xE0 faixa seguinte", nl: "Afstand tot volgende nummer", fr: "Espacement jusqu'au titre suivant", it: "Spaziatura dal brano successivo", es: "Espacio hasta la pista siguiente", pl: "Odst\u0119p do nast\u0119pnego utworu", uk: "\u0412\u0456\u0434\u0441\u0442\u0443\u043F \u0434\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043A\u0443", "zh-cn": "\u4E0E\u4E0B\u4E00\u66F2\u76EE\u7684\u95F4\u8DDD" },
        showThumbnail: { en: "Show thumbnail", de: "Thumbnail anzeigen", ru: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u0430\u0442\u044E\u0440\u0443", pt: "Mostrar miniatura", nl: "Miniatuur tonen", fr: "Afficher la miniature", it: "Mostra miniatura", es: "Mostrar miniatura", pl: "Poka\u017C miniatur\u0119", uk: "\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043C\u0456\u043D\u0456\u0430\u0442\u044E\u0440\u0443", "zh-cn": "\u663E\u793A\u7F29\u7565\u56FE" },
        showIndex: { en: "Show track index", de: "Titelindex anzeigen", ru: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0442\u0440\u0435\u043A\u0430", pt: "Mostrar \xEDndice da faixa", nl: "Nummerindex tonen", fr: "Afficher l'index du titre", it: "Mostra indice del brano", es: "Mostrar \xEDndice de pista", pl: "Poka\u017C indeks utworu", uk: "\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043D\u043E\u043C\u0435\u0440 \u0442\u0440\u0435\u043A\u0443", "zh-cn": "\u663E\u793A\u66F2\u76EE\u7D22\u5F15" },
        buttonmargin: { en: "Button spacing", de: "Abstand zwischen Schaltfl\xE4chen", ru: "\u0420\u0430\u0441\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043C\u0435\u0436\u0434\u0443 \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438", pt: "Espa\xE7amento entre bot\xF5es", nl: "Afstand tussen knoppen", fr: "Espacement entre les boutons", it: "Spaziatura tra i pulsanti", es: "Espacio entre botones", pl: "Odst\u0119p mi\u0119dzy przyciskami", uk: "\u0412\u0456\u0434\u0441\u0442\u0430\u043D\u044C \u043C\u0456\u0436 \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438", "zh-cn": "\u6309\u94AE\u95F4\u8DDD" },
        favoriteConfiguration: { en: "Favorite configuration", de: "Favoritenkonfiguration", ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E", pt: "Configura\xE7\xE3o de favoritos", nl: "Favorietenconfiguratie", fr: "Configuration des favoris", it: "Configurazione dei preferiti", es: "Configuraci\xF3n de favoritos", pl: "Konfiguracja ulubionych", uk: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043E\u0431\u0440\u0430\u043D\u043E\u0433\u043E", "zh-cn": "\u6536\u85CF\u914D\u7F6E" },
        formatbutton: { en: "Buttons", de: "Schaltfl\xE4chen", ru: "\u041A\u043D\u043E\u043F\u043A\u0438", pt: "Bot\xF5es", nl: "Knoppen", fr: "Boutons", it: "Pulsanti", es: "Botones", pl: "Przyciski", uk: "\u041A\u043D\u043E\u043F\u043A\u0438", "zh-cn": "\u6309\u94AE" },
        formatselect: { en: "Selection list", de: "Auswahlliste", ru: "\u0421\u043F\u0438\u0441\u043E\u043A \u0432\u044B\u0431\u043E\u0440\u0430", pt: "Lista de sele\xE7\xE3o", nl: "Keuzelijst", fr: "Liste de s\xE9lection", it: "Elenco di selezione", es: "Lista de selecci\xF3n", pl: "Lista wyboru", uk: "\u0421\u043F\u0438\u0441\u043E\u043A \u0432\u0438\u0431\u043E\u0440\u0443", "zh-cn": "\u9009\u62E9\u5217\u8868" },
        formattype: { en: "Display format", de: "Anzeigeformat", ru: "\u0424\u043E\u0440\u043C\u0430\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F", pt: "Formato de exibi\xE7\xE3o", nl: "Weergaveformaat", fr: "Format d'affichage", it: "Formato di visualizzazione", es: "Formato de visualizaci\xF3n", pl: "Format wy\u015Bwietlania", uk: "\u0424\u043E\u0440\u043C\u0430\u0442 \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F", "zh-cn": "\u663E\u793A\u683C\u5F0F" },
        playerConfiguration: { en: "Player configuration", de: "Playerkonfiguration", ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043F\u0440\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0442\u0435\u043B\u0435\u0439", pt: "Configura\xE7\xE3o dos leitores", nl: "Spelerconfiguratie", fr: "Configuration des lecteurs", it: "Configurazione dei lettori", es: "Configuraci\xF3n de reproductores", pl: "Konfiguracja odtwarzaczy", uk: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u0432\u0430\u0447\u0456\u0432", "zh-cn": "\u64AD\u653E\u5668\u914D\u7F6E" },
        mainbarcolor: { en: "Main bar color", de: "Farbe der Hauptleiste", ru: "\u0426\u0432\u0435\u0442 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043F\u043E\u043B\u043E\u0441\u044B", pt: "Cor da barra principal", nl: "Kleur van de hoofdbalk", fr: "Couleur de la barre principale", it: "Colore della barra principale", es: "Color de la barra principal", pl: "Kolor paska g\u0142\xF3wnego", uk: "\u041A\u043E\u043B\u0456\u0440 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0457 \u0441\u043C\u0443\u0433\u0438", "zh-cn": "\u4E3B\u8FDB\u5EA6\u6761\u989C\u8272" },
        playtimebarcolor: { en: "Elapsed time bar color", de: "Farbe der Laufzeitleiste", ru: "\u0426\u0432\u0435\u0442 \u043F\u043E\u043B\u043E\u0441\u044B \u043F\u0440\u043E\u0448\u0435\u0434\u0448\u0435\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438", pt: "Cor da barra de tempo decorrido", nl: "Kleur van de verstreken-tijdbalk", fr: "Couleur de la barre du temps \xE9coul\xE9", it: "Colore della barra del tempo trascorso", es: "Color de la barra de tiempo transcurrido", pl: "Kolor paska up\u0142ywu czasu", uk: "\u041A\u043E\u043B\u0456\u0440 \u0441\u043C\u0443\u0433\u0438 \u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E \u0447\u0430\u0441\u0443", "zh-cn": "\u5DF2\u64AD\u653E\u65F6\u95F4\u6761\u989C\u8272" },
        bordercolor: { en: "Border color", de: "Rahmenfarbe", ru: "\u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438", pt: "Cor da borda", nl: "Randkleur", fr: "Couleur de bordure", it: "Colore bordo", es: "Color del borde", pl: "Kolor obramowania", uk: "\u041A\u043E\u043B\u0456\u0440 \u0440\u0430\u043C\u043A\u0438", "zh-cn": "\u8FB9\u6846\u989C\u8272" },
        playerattribute: { en: "Player attribute", de: "Player-Attribut", ru: "\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u043F\u0440\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0442\u0435\u043B\u044F", pt: "Atributo do leitor", nl: "Spelerattribuut", fr: "Attribut du lecteur", it: "Attributo del lettore", es: "Atributo del reproductor", pl: "Atrybut odtwarzacza", uk: "\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u043F\u0440\u043E\u0433\u0440\u0430\u0432\u0430\u0447\u0430", "zh-cn": "\u64AD\u653E\u5668\u5C5E\u6027" },
        format: { en: "Format", de: "Format", ru: "\u0424\u043E\u0440\u043C\u0430\u0442", pt: "Formato", nl: "Indeling", fr: "Format", it: "Formato", es: "Formato", pl: "Format", uk: "\u0424\u043E\u0440\u043C\u0430\u0442", "zh-cn": "\u683C\u5F0F" },
        debug: { en: "Debug", de: "Debug-Ausgaben", ru: "\u041E\u0442\u043B\u0430\u0434\u043A\u0430", pt: "Depura\xE7\xE3o", nl: "Foutopsporing", fr: "D\xE9bogage", it: "Debug", es: "Depuraci\xF3n", pl: "Debugowanie", uk: "\u041D\u0430\u043B\u0430\u0433\u043E\u0434\u0436\u0435\u043D\u043D\u044F", "zh-cn": "\u8C03\u8BD5" },
        debugwithFetchResults: { en: "Debug with fetched results", de: "Debug-Ausgaben mit abgerufenen Ergebnissen", ru: "\u041E\u0442\u043B\u0430\u0434\u043A\u0430 \u0441 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u044B\u043C\u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u043C\u0438", pt: "Depura\xE7\xE3o com resultados obtidos", nl: "Foutopsporing met opgehaalde resultaten", fr: "D\xE9bogage avec les r\xE9sultats r\xE9cup\xE9r\xE9s", it: "Debug con i risultati recuperati", es: "Depuraci\xF3n con los resultados obtenidos", pl: "Debugowanie z pobranymi wynikami", uk: "\u041D\u0430\u043B\u0430\u0433\u043E\u0434\u0436\u0435\u043D\u043D\u044F \u0437 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u0438\u043C\u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u043C\u0438", "zh-cn": "\u8C03\u8BD5\u5E76\u8F93\u51FA\u83B7\u53D6\u7ED3\u679C" }
      };
    }
  });

  // squeezeboxrpc/js/date.format.js
  var require_date_format = __commonJS({
    "squeezeboxrpc/js/date.format.js"(exports) {
      "use strict";
      (function() {
        Date.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        Date.longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        Date.longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const replaceChars = {
          // Day
          d: function() {
            const d = this.getDate();
            return (d < 10 ? "0" : "") + d;
          },
          D: function() {
            return Date.shortDays[this.getDay()];
          },
          j: function() {
            return this.getDate();
          },
          l: function() {
            return Date.longDays[this.getDay()];
          },
          N: function() {
            const N = this.getDay();
            return N === 0 ? 7 : N;
          },
          S: function() {
            const S = this.getDate();
            return S % 10 === 1 && S !== 11 ? "st" : S % 10 === 2 && S !== 12 ? "nd" : S % 10 === 3 && S !== 13 ? "rd" : "th";
          },
          w: function() {
            return this.getDay();
          },
          z: function() {
            const d = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((this - d) / 864e5);
          },
          // Week
          W: function() {
            const target = new Date(this.valueOf());
            const dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            const firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
              target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
            }
            const retVal = 1 + Math.ceil((firstThursday - target) / 6048e5);
            return retVal < 10 ? "0" + retVal : retVal;
          },
          // Month
          F: function() {
            return Date.longMonths[this.getMonth()];
          },
          m: function() {
            const m = this.getMonth();
            return (m < 9 ? "0" : "") + (m + 1);
          },
          M: function() {
            return Date.shortMonths[this.getMonth()];
          },
          n: function() {
            return this.getMonth() + 1;
          },
          t: function() {
            let year = this.getFullYear();
            let nextMonth = this.getMonth() + 1;
            if (nextMonth === 12) {
              year = year++;
              nextMonth = 0;
            }
            return new Date(year, nextMonth, 0).getDate();
          },
          // Year
          L: function() {
            const L = this.getFullYear();
            return L % 400 === 0 || L % 100 !== 0 && L % 4 === 0;
          },
          o: function() {
            const d = new Date(this.valueOf());
            d.setDate(d.getDate() - (this.getDay() + 6) % 7 + 3);
            return d.getFullYear();
          },
          Y: function() {
            return this.getFullYear();
          },
          y: function() {
            return ("" + this.getFullYear()).substr(2);
          },
          // Time
          a: function() {
            return this.getHours() < 12 ? "am" : "pm";
          },
          A: function() {
            return this.getHours() < 12 ? "AM" : "PM";
          },
          B: function() {
            return Math.floor(((this.getUTCHours() + 1) % 24 + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1e3 / 24);
          },
          g: function() {
            return this.getHours() % 12 || 12;
          },
          G: function() {
            return this.getHours();
          },
          h: function() {
            const h = this.getHours();
            return ((h % 12 || 12) < 10 ? "0" : "") + (h % 12 || 12);
          },
          H: function() {
            const H = this.getHours();
            return (H < 10 ? "0" : "") + H;
          },
          i: function() {
            const i = this.getMinutes();
            return (i < 10 ? "0" : "") + i;
          },
          s: function() {
            const s = this.getSeconds();
            return (s < 10 ? "0" : "") + s;
          },
          v: function() {
            const v = this.getMilliseconds();
            return (v < 10 ? "00" : v < 100 ? "0" : "") + v;
          },
          // Timezone
          e: function() {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
          },
          I: function() {
            let DST = null;
            for (let i = 0; i < 12; ++i) {
              const d = new Date(this.getFullYear(), i, 1);
              const offset = d.getTimezoneOffset();
              if (DST === null) DST = offset;
              else if (offset < DST) {
                DST = offset;
                break;
              } else if (offset > DST) break;
            }
            return this.getTimezoneOffset() === DST | 0;
          },
          O: function() {
            const O = this.getTimezoneOffset();
            return (-O < 0 ? "-" : "+") + (Math.abs(O / 60) < 10 ? "0" : "") + Math.floor(Math.abs(O / 60)) + (Math.abs(O % 60) === 0 ? "00" : (Math.abs(O % 60) < 10 ? "0" : "") + Math.abs(O % 60));
          },
          P: function() {
            const P = this.getTimezoneOffset();
            return (-P < 0 ? "-" : "+") + (Math.abs(P / 60) < 10 ? "0" : "") + Math.floor(Math.abs(P / 60)) + ":" + (Math.abs(P % 60) === 0 ? "00" : (Math.abs(P % 60) < 10 ? "0" : "") + Math.abs(P % 60));
          },
          T: function() {
            const tz = this.toLocaleTimeString(navigator.language, { timeZoneName: "short" }).split(" ");
            return tz[tz.length - 1];
          },
          Z: function() {
            return -this.getTimezoneOffset() * 60;
          },
          // Full Date/Time
          c: function() {
            return this.format("Y-m-d\\TH:i:sP");
          },
          r: function() {
            return this.toString();
          },
          U: function() {
            return Math.floor(this.getTime() / 1e3);
          }
        };
        Date.prototype.format = function(format) {
          const date = this;
          return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
            return esc === "" && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
          });
        };
      }).call(exports);
    }
  });

  // squeezeboxrpc/js/sbClasses.js
  function parseRequestFactory(request) {
    console.log(`parseRequestFactory`);
    let result = request.result;
    if (result.albums_loop) {
      return new Albums(request);
    }
    if (result.artists_loop) {
      return new Artists(request);
    }
    if (result.genres_loop) {
      return new Genres(request);
    }
    if (result.works_loop) {
      return new Works(request);
    }
    if (result.years_loop) {
      return new Years(request);
    }
    if (result.item_loop) {
      return new Items(request);
    }
    if (result.titles_loop) {
      return new Tracks(request);
    }
    if (result.playlisttracks_loop) {
      return new PlaylistTracks(request);
    }
    if (result.playlists_loop) {
      return new Playlists(request);
    }
    let requestCommand = request.params[1][0];
    if (requestCommand === "selectVirtualLibrary" && !result.item_loop) {
      return new Items(request);
    }
  }
  var Albums = class {
    constructor(request) {
      console.log(`Albums`);
      this.albums = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.albums_loop) {
        let albums = result.albums_loop;
        return albums.map((item) => {
          return new Album(item, request);
        });
      }
    }
    getMenuItems() {
      return this.albums.map((item) => item.getMenu());
    }
  };
  var Album = class {
    constructor(request_item, request) {
      this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
      this.id = request_item.id || void 0;
      this.performance = request_item.performance || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      this.favorites_title = request_item.favorites_title || void 0;
      this.album = request_item.album || void 0;
      this.year = request_item.year || void 0;
      this.artwork_track_id = request_item.artwork_track_id || void 0;
      this.compilation = request_item.compilation || void 0;
      this.artist_id = request_item.artist_id || void 0;
      this.artist = request_item.artist || void 0;
      this.textkey = request_item.textkey || void 0;
      let additionalPlayParams = [getParamsFromCommand(request.params[1], "role_id:")];
      this.actions = {
        next: {
          command: ["tracks"],
          params: ["tags:distbhz1kyuAACGPSE", "sort:tracknum", `album_id:${this.id}`]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `album_id:${this.id}`, `performance:`, ...additionalPlayParams, `library_id:-1`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `album_id:${this.id}`, `performance:`]
        }
      };
    }
    getMenu() {
      return {
        id: this.id,
        title: `${this.artist} / ${this.album} ${this.year ? `(${this.year})` : ""}`,
        image: `/music/${this.artwork_track_id}/cover_300x300_f`,
        type: "album",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Artists = class {
    constructor(request) {
      console.log(`Artists`);
      this.artists = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.artists_loop) {
        let artists = result.artists_loop;
        return artists.map((item) => {
          return new Artist(item, request);
        });
      }
    }
    getMenuItems() {
      return this.artists.map((item) => item.getMenu());
    }
  };
  var Artist = class {
    constructor(request_item, request) {
      this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
      this.id = request_item.id || void 0;
      this.artist = request_item.artist || void 0;
      this.textkey = request_item.textkey || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      let additionalPlayParams = [getParamsFromCommand(request.params[1], "role_id:")];
      this.actions = {
        next: {
          command: ["albums"],
          params: ["tags:aajlqswyKSSE", "sort:yearalbum", `artist_id:${this.id}`]
        },
        play: {
          command: ["playlistcontrol"],
          params: [
            `cmd:load`,
            `role_id:ALBUMARTIST`,
            `artist_id:${this.id}`,
            `sort:yearalbum`,
            ...additionalPlayParams,
            `library_id:-1`
          ]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `role_id:ALBUMARTIST`, `artist_id:${this.id}`, `sort:yearalbum`]
        }
      };
    }
    getMenu() {
      return {
        id: this.id,
        title: this.artist,
        image: `/imageproxy/mai/artist/${this.id}/image_300x300_f`,
        type: "artist",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Genres = class {
    constructor(request) {
      console.log(`Genres`);
      this.genres = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.genres_loop) {
        let genres = result.genres_loop;
        return genres.map((item) => {
          return new Genre(item);
        });
      }
    }
    getMenuItems() {
      return this.genres.map((item) => item.getMenu());
    }
  };
  var Genre = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.id || void 0;
      this.genre = request_item.genre || void 0;
      this.textkey = request_item.textkey || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      this.actions = {
        next: {
          command: ["tracks"],
          params: [`genre_id:${request_item.id}`, "tags:distbhz1kyuAACGPScelyE", "msk-sort:yearalbumtrack:Album"]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `genre_id:${this.id}`, `sort:album`, `library_id:-1`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `genre_id:${this.id}`, `sort:album`]
        }
      };
    }
    getMenu() {
      return {
        id: this.id,
        title: `${this.genre}`,
        image: null,
        type: "genre",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Playlists = class {
    constructor(request) {
      console.log(`Playlists`);
      this.playlists = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.playlists_loop) {
        let playlists = result.playlists_loop;
        return playlists.map((item) => {
          return new Playlist(item);
        });
      }
    }
    getMenuItems() {
      return this.playlists.map((item) => item.getMenu());
    }
  };
  var Playlist = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.id || void 0;
      this.playlist = request_item.playlist || void 0;
      this.url = request_item.url || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      this.textkey = request_item.textkey || void 0;
      this.extid = request_item.extid || void 0;
      this.remote = request_item.remote || void 0;
      this.actions = {
        next: {
          command: ["playlists", "tracks"],
          params: [`playlist_id:${request_item.id}`, "tags:distbhz1acelyAGKPS"]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `playlist_id:${this.id}`, `performance:`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `playlist_id:${this.id}`, `performance:`]
        }
      };
    }
    getMenu() {
      return {
        id: this.id,
        title: `${this.playlist}`,
        image: null,
        type: "playlist",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Works = class {
    constructor(request) {
      console.log(`Works`);
      this.works = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.works_loop) {
        let works = result.works_loop;
        return works.map((item) => {
          return new Work(item);
        });
      }
    }
    getMenuItems() {
      return this.works.map((item) => item.getMenu());
    }
  };
  var Work = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.work_id || void 0;
      this.composer = request_item.composer || void 0;
      this.work = request_item.work || void 0;
      this.composer_id = request_item.composer_id || void 0;
      this.album_id = request_item.album_id || void 0;
      this.textkey = request_item.textkey || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      this.favorites_title = request_item.favorites_title || void 0;
      this.actions = {
        next: {
          command: ["albums"],
          params: [
            "tags:aajlqswyKSSE",
            `work_id:${this.id}`,
            `composer_id:${this.composer_id}`,
            `album_id:${this.album_id}`
          ]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `work_id:${this.id}`, `album_id:${this.album_id}`, `performance:`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `work_id:${this.id}`, `album_id:${this.album_id}`, `performance:`]
        }
      };
    }
    getMenu() {
      return {
        id: `work_id:${this.id}`,
        title: `${this.favorites_title}`,
        image: null,
        type: "work",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Years = class {
    constructor(request) {
      console.log(`Years`);
      this.years = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.years_loop) {
        let years = result.years_loop;
        return years.map((item) => {
          return new Year(item);
        });
      }
    }
    getMenuItems() {
      return this.years.map((item) => item.getMenu());
    }
  };
  var Year = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.year || void 0;
      this.year = request_item.year || void 0;
      this.favorites_url = request_item.favorites_url || void 0;
      this.actions = {
        next: {
          command: ["albums"],
          params: [
            "release_type:Album",
            "tags:aajlqswyKSSE",
            "sort:album",
            "menu:1",
            `year:${request_item.year}`
          ]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `year:${this.id}`, `library_id:-1`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `year:${this.id}`]
        }
      };
    }
    getMenu() {
      return {
        id: `year_id:${this.id}`,
        title: `${this.year}`,
        image: null,
        type: "year",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var Tracks = class {
    constructor(request) {
      console.log(`Tracks`);
      this.tracks = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.titles_loop) {
        let tracks = result.titles_loop;
        return tracks.map((item) => {
          return new Track(item);
        });
      }
    }
    getMenuItems() {
      return this.tracks.map((item) => item.getMenu());
    }
  };
  var Track = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.id || void 0;
      this.title = request_item.title || void 0;
      this.duration = request_item.duration || void 0;
      this.artist_id = request_item.artist_id || void 0;
      this.tracknum = request_item.tracknum || void 0;
      this.year = request_item.year || void 0;
      this.albumartist = request_item.albumartist || void 0;
      this.trackartist = request_item.trackartist || void 0;
      this.compilation = request_item.compilation || void 0;
      this.genres = request_item.genres || void 0;
      this.genre_ids = request_item.genre_ids || void 0;
      this.albumartist_ids = request_item.albumartist_ids || void 0;
      this.trackartist_ids = request_item.trackartist_ids || void 0;
      this.actions = {
        play: {
          command: ["playlistcontrol"],
          params: [`cmd:load`, `track_id:${this.id}`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`cmd:add`, `track_id:${this.id}`]
        }
      };
    }
    getMenu() {
      return {
        id: `track_id:${this.id}`,
        title: `${this.title}`,
        image: null,
        type: "track",
        item: this,
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var PlaylistTracks = class {
    constructor(request) {
      console.log(`PlaylistTracks`);
      this.playlisttracks = this.parseRequest(request);
    }
    parseRequest(request) {
      let result = request.result;
      if (result.playlisttracks_loop) {
        let playlisttracks = result.playlisttracks_loop;
        return playlisttracks.map((item) => {
          return new PlaylistTrack(item);
        });
      }
    }
    getMenuItems() {
      return this.playlisttracks.map((item) => item.getMenu());
    }
  };
  var PlaylistTrack = class {
    constructor(request_item) {
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.id || void 0;
      this.title = request_item.title || void 0;
      this["playlist index"] = request_item["playlist index"] || void 0;
      this.title = request_item.title || void 0;
      this.duration = request_item.duration || void 0;
      this.artist_ids = request_item.artist_ids || void 0;
      this.tracknum = request_item.tracknum || void 0;
      this.artist = request_item.artist || void 0;
      this.coverid = request_item.coverid || void 0;
      this.album_id = request_item.album_id || void 0;
      this.album = request_item.album || void 0;
      this.year = request_item.year || void 0;
      this.genres = request_item.genres || void 0;
      this.genre_ids = request_item.genre_ids || void 0;
      this.artist_ids = request_item.artist_ids || void 0;
      this.actions = {
        next: {
          command: ["playlist", "tracks"],
          params: ["tags:distbhz1acelyAGKPS", "playlist_id:${this.id}"]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`menu:1`, `cmd:load`, `folder_id:${this.id}`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`menu:1`, `cmd:add`, `folder_id:${this.id}`]
        }
      };
    }
    getMenu() {
      return {
        id: `track_id:${this.id}`,
        title: `${this.title}`,
        image: null,
        type: "playlisttrack",
        item: this
      };
    }
  };
  var Items = class {
    constructor(request) {
      console.log(`Items`);
      let filesystem = request.params[1].includes("mode:filesystem");
      let requestCommand = request.params[1][0] + (filesystem ? "FS" : "");
      this.items = this.parseRequest(request, requestCommand);
    }
    parseRequest(request, requestCommand) {
      let result = request.result;
      if (result.item_loop) {
        let items = result.item_loop;
        return items.map((item) => {
          return Item.create(item, requestCommand, request);
        });
      }
      if (!result.titles_loop && requestCommand === "selectVirtualLibrary") {
        return [
          Item.create(
            {
              type: "virtualLibraryAnswer",
              text: request.result.title
            },
            requestCommand
          )
        ];
      }
    }
    getMenuItems() {
      return this.items.map((item) => item.getMenu());
    }
  };
  var Item = class {
    // item types
    // search|text|textarea|audio|playlist|link|opml|replace|redirect|radio
    static create(request_item, requestCommand, request) {
      console.log(`Item switch: ${requestCommand}_${request_item.type || ""}`);
      switch (`${requestCommand}_${request_item.type || ""}`) {
        case "radios_":
        case "local_":
        case "music_":
        case "sports_":
        case "news_":
        case "talk_":
        case "location_":
        case "language_":
        case "podcast_":
        case "local_link":
        case "music_link":
        case "sports_link":
        case "news_link":
        case "talk_link":
        case "location_link":
        case "language_link":
        case "podcast_link":
          return new ItemRadio(request_item, requestCommand);
        case "local_text":
        case "music_text":
        case "sports_text":
        case "news_text":
        case "talk_text":
        case "location_text":
        case "language_text":
        case "podcast_text":
        case "browselibrary_text":
        case "browselibraryFS_text":
          return new ItemText(request_item, requestCommand);
        case "menu_":
          return new ItemMenu(request_item, request);
        case "browselibrary_playlist":
        case "favorites_playlist":
          return new ItemPlaylist(request_item, false);
        case "browselibraryFS_playlist":
          return new ItemPlaylist(request_item, true);
        case "browselibraryFS_":
          return new ItemFilesystem(request_item);
        case "browselibrary_audio":
        //ok
        case "browselibraryFS_audio":
        //ok
        case "local_audio":
        //ok
        case "music_audio":
        //ok
        case "sports_audio":
        //ok
        case "news_audio":
        //ok
        case "talk_audio":
        //ok
        case "location_audio":
        //ok
        case "language_audio":
        //ok
        case "podcast_audio":
        //ok
        case "favorites_audio":
          return new ItemAudio(request_item, requestCommand);
        case "selectVirtualLibrary_virtualLibraryAnswer":
          return new ItemVirtualLibraryAnswer(request_item);
        case "selectVirtualLibrary_":
        case "selectVirtualLibrary_outline":
          return new ItemVirtualLibrary(request_item);
        case "myapps_redirect":
          return new ItemApplication(request_item);
        default:
          return new ItemMenu(request_item, request);
      }
    }
  };
  var ItemApplication = class extends Item {
    constructor(request_item) {
      super(request_item);
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.actions.go.params.menu || void 0;
      this.text = request_item.text.trim() || void 0;
      this.iconid = request_item["icon-id"] || void 0;
      this.actions = {};
      if (request_item.actions["go"]) {
        this.actions = __spreadValues(__spreadValues({}, this.actions), { next: translateMyMusicParameters(request_item.actions.go) });
      }
      if (request_item.actions["play"]) {
        this.actions = __spreadValues(__spreadValues({}, this.actions), { play: translateMyMusicParameters(request_item.actions.play) });
      }
      if (request_item.actions["add"]) {
        this.actions = __spreadValues(__spreadValues({}, this.actions), { add: translateMyMusicParameters(request_item.actions.add) });
      }
    }
    getMenu() {
      return {
        id: this.id,
        title: this.text,
        image: this.icon,
        type: "itemapplication",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemRadio = class extends Item {
    constructor(request_item, requestCommand) {
      super(request_item);
      this.parseRequest(request_item, requestCommand);
    }
    parseRequest(request_item, requestCommand) {
      var _a, _b;
      let cmd;
      if ((_a = request_item.actions) == null ? void 0 : _a.go) {
        cmd = translateMyMusicParameters((_b = request_item.actions) == null ? void 0 : _b.go);
      } else {
        cmd = {
          command: [requestCommand, "items"],
          params: [`menu:${requestCommand}`, `item_id:${request_item.actions.go.params.item_id}`]
        };
      }
      this.id = request_item.actions.go.params.item_id || request_item.actions.go.params.menu || void 0;
      this.text = request_item.text || void 0;
      this.actions = {
        next: cmd
      };
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: this.text,
        image: null,
        type: "radiolocal",
        param: JSON.stringify(this.actions.next),
        item: this,
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemMenu = class extends Item {
    constructor(request_item, request) {
      super(request_item);
      this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
      this.id = request_item.text || void 0;
      this.text = request_item.text || "Empty";
      this.node = request_item.node || void 0;
      this.weight = request_item.weight || void 0;
      if (request_item.actions) {
        if (request_item.actions["go"]) {
          this.actions = __spreadValues(__spreadValues({}, this.actions), { next: translateMyMusicParameters(request_item.actions.go) });
        }
        if (request_item.actions["play"]) {
          this.actions = __spreadValues(__spreadValues({}, this.actions), { play: translateMyMusicParameters(request_item.actions.play) });
        }
        if (request_item.actions["add"]) {
          this.actions = __spreadValues(__spreadValues({}, this.actions), { add: translateMyMusicParameters(request_item.actions.add) });
        }
        if (request_item.actions["do"]) {
          this.actions = __spreadValues(__spreadValues({}, this.actions), { add: translateMyMusicParameters(request_item.actions.do) });
        }
      }
      if (request_item.goAction) {
        if (request_item.goAction == "play") {
          const filteredParams = Object.keys(request_item.params).filter((key) => !key.includes("touchToPlay")).reduce((obj, key) => {
            obj[key] = request_item.params[key];
            return obj;
          }, {});
          this.actions = {
            play: {
              command: request.result.base.actions[request_item.goAction].cmd,
              params: [
                ...object2Array(__spreadValues(__spreadValues({}, request.result.base.actions[request_item.goAction].params), filteredParams))
              ]
            }
          };
        }
      }
    }
    getMenu() {
      return {
        id: this.id,
        title: this.text,
        image: null,
        type: "menu",
        actions: JSON.stringify(this.actions),
        item: this
      };
    }
  };
  var ItemFilesystem = class extends Item {
    constructor(request_item) {
      super(request_item);
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      var _a, _b, _c;
      let cmd;
      if ((_a = request_item.actions) == null ? void 0 : _a.go) {
        cmd = translateMyMusicParameters((_b = request_item.actions) == null ? void 0 : _b.go);
      }
      this.id = ((_c = request_item.actions) == null ? void 0 : _c.go.params.item_id) || void 0;
      this.text = request_item.text || void 0;
      this.actions = {
        next: cmd
      };
    }
    getMenu() {
      return {
        id: this.id,
        title: this.text,
        image: null,
        type: "menu",
        param: JSON.stringify(this.actions.next),
        item: this,
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemPlaylist = class extends Item {
    constructor(request_item, filesystem) {
      super(request_item);
      this.parseRequest(request_item, filesystem);
    }
    parseRequest(request_item, filesystem) {
      var _a;
      this.id = ((_a = request_item.actions) == null ? void 0 : _a.more.params.folder_id) || void 0;
      this.text = request_item.text || void 0;
      this.textkey = request_item.textkey || void 0;
      this.actions = {
        next: {
          command: ["browselibrary", "items"],
          params: [
            "menu:browselibrary",
            filesystem ? "mode:filesystem" : "mode:bmf",
            ...object2Array(request_item.params)
          ]
        },
        play: {
          command: ["playlistcontrol"],
          params: [`menu:1`, `cmd:load`, `folder_id:${this.id}`]
        },
        add: {
          command: ["playlistcontrol"],
          params: [`menu:1`, `cmd:add`, `folder_id:${this.id}`]
        }
      };
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: `(D) ${this.text}`,
        image: null,
        type: "itemplaylist",
        param: JSON.stringify(this.actions.next),
        item: this,
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemText = class extends Item {
    constructor(request_item) {
      super(request_item);
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      this.id = request_item.text || void 0;
      this.text = request_item.text || void 0;
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: this.text,
        image: null,
        type: "itemtext",
        param: null,
        item: this
      };
    }
  };
  var ItemAudio = class extends Item {
    constructor(request_item, requestCommand) {
      super(request_item);
      this.parseRequest(request_item, requestCommand);
    }
    parseRequest(request_item, requestCommand) {
      var _a, _b;
      this.id = ((_a = request_item.commonParams) == null ? void 0 : _a.track_id) || ((_b = request_item.params) == null ? void 0 : _b.item_id) || void 0;
      this.text = request_item.text || void 0;
      this.textkey = request_item.textkey || void 0;
      this.icon = request_item.icon || void 0;
      this.iconid = request_item["icon-id"] || void 0;
      this.favorites_type = request_item.presetParams.favorites_type || void 0;
      this.favorites_url = request_item.presetParams.favorites_url || void 0;
      this.favorites_title = request_item.presetParams.favorites_title || void 0;
      this.icon = request_item.presetParams.icon || void 0;
      this.actions = {
        play: {
          command: [...requestCommand === "browselibraryFS" ? ["browselibrary"] : [requestCommand]],
          params: [
            "playlist",
            "play",
            ...requestCommand === "browselibrary" ? ["mode:bmf"] : [],
            ...requestCommand === "browselibraryFS" ? ["mode:filesystem"] : [],
            ...requestCommand === "browselibraryFS" ? ["menu:browselibrary"] : [requestCommand],
            `item_id:${this.id}`,
            `isContextMenu:1`
          ]
        },
        add: {
          command: [...requestCommand === "browselibraryFS" ? ["browselibrary"] : [requestCommand]],
          params: [
            "playlist",
            "add",
            ...requestCommand === "browselibrary" ? ["mode:bmf"] : [],
            ...requestCommand === "browselibraryFS" ? ["mode:filesystem"] : [],
            ...requestCommand === "browselibraryFS" ? ["menu:browselibrary"] : [requestCommand],
            `item_id:${this.id}`,
            `isContextMenu:1`
          ]
        }
      };
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: `${this.text}`,
        image: this.icon,
        type: "itemaudio",
        item: this,
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemVirtualLibrary = class extends Item {
    constructor(request_item) {
      super(request_item);
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      var _a;
      this.id = ((_a = request_item.actions) == null ? void 0 : _a.go.params.item_id) || void 0;
      this.text = request_item.text || void 0;
      let cmd = {
        command: ["selectVirtualLibrary", "items"],
        params: [`item_id:${request_item.actions.go.params.item_id}`, "menu:selectVirtualLibrary"]
      };
      this.actions = {
        next: cmd
      };
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: this.text,
        image: null,
        type: "itemvirtuallibrary",
        item: this,
        param: JSON.stringify(this.actions.next),
        actions: JSON.stringify(this.actions)
      };
    }
  };
  var ItemVirtualLibraryAnswer = class extends Item {
    constructor(request_item) {
      super(request_item);
      this.parseRequest(request_item);
    }
    parseRequest(request_item) {
      var _a;
      this.id = ((_a = request_item.actions) == null ? void 0 : _a.go.params.item_id) || void 0;
      this.text = request_item.text || void 0;
    }
    getMenu() {
      return {
        id: `item_id:${this.id}`,
        title: this.text,
        image: null,
        type: "itemvirtuallibraryanswer",
        item: this,
        param: null
      };
    }
  };
  function object2Array(obj) {
    return Object.keys(obj).map(function(key) {
      return `${key}:${obj[key]}`;
    });
  }
  function getParamsFromCommand(params, key) {
    return params.find((item) => item.toString().startsWith(key));
  }
  function translateMyMusicParameters(command) {
    console.log(command);
    if (command.cmd == void 0) {
      return void 0;
    }
    var cmd = { command: [...command.cmd], params: [] };
    for (var key in command.params) {
      let p2 = command.params[key];
      if (p2 != void 0 && p2 != null && p2.length > 0) {
        cmd.params.push(`${key}:${p2}`);
      }
    }
    let c = [];
    let p = [];
    var mode = void 0;
    var canReplace = true;
    var hasSort = false;
    var hasTags = false;
    var hasArtistId = false;
    var hasLibraryId = false;
    var hasNonArtistRole = false;
    for (let i2 = 0, params = cmd.params; i2 < cmd.params.length; i2++) {
      if (params[i2].startsWith("mode:")) {
        mode = params[i2].split(":")[1];
        if (mode.startsWith("myMusicArtists")) {
          mode = "artists";
        } else if (mode.startsWith("myMusicAlbums") || mode == "randomalbums" || mode == "vaalbums" || mode == "recentlychanged") {
          mode = "albums";
        } else if (mode == "years") {
          p.push("hasAlbums:1");
        } else if (mode.startsWith("myMusicWorks")) {
          mode = "works";
        } else if (mode != "artists" && mode != "albums" && mode != "genres" && mode != "tracks" && mode != "playlists" && mode != "works") {
          canReplace = false;
          break;
        }
        c.push(mode);
      }
      if (!params[i2].startsWith("menu:")) {
        if (params[i2].startsWith("tags:")) {
          if (params[i2].split(":")[1].indexOf("s") < 0) {
            i2 += "s";
          }
          p.push(params[i2]);
          hasTags = true;
        } else {
          p.push(params[i2]);
          if (params[i2].startsWith("sort:")) {
            hasSort = true;
          } else if (params[i2].startsWith("artist_id:")) {
            hasArtistId = true;
          } else if (params[i2].startsWith("library_id:")) {
            hasLibraryId = true;
          } else if (params[i2].startsWith("role_id:")) {
            var role = params[i2].split(":")[1].toLowerCase();
            if ("albumartist" != role && "5" != role) {
              hasNonArtistRole = true;
            }
          }
        }
      }
    }
    if (canReplace && c.length == 1 && mode) {
      if (mode == "tracks") {
        if (!hasTags) {
          p.push("tags:distbhz1kyuAACGPSc");
        }
        if (!hasSort) {
          p.push("sort:tracknum");
        }
      } else if (mode == "albums") {
        if (!hasTags) {
          p.push(hasArtistId ? "ArAlTP" : "AlTP");
        }
        if (!hasSort) {
          p.push(`sort:album`);
        }
      } else if (mode == "playlists") {
        if (!hasTags) {
          p.push("PlTP");
        }
      } else if (!hasTags) {
        if (mode == "artists" || mode == "vaalbums") {
          p.push("ArTP");
          if (!hasLibraryId && !hasNonArtistRole) {
            p.push("include_online_only_artists:1");
          }
        } else if (mode == "years" || mode == "genres") {
          p.push("tags:s");
        }
      }
      cmd = { command: c, params: p };
    }
    if (cmd.params.length > 0) {
      for (var i = 0, len = cmd.params.length; i < len; ++i) {
        cmd.params[i] = cmd.params[i].replace("ArAlTP", "tags:aajlqswyKRSSW2").replace("ArTP", "tags:s").replace("PlTP", "tags:suxE").replace("AlTP", "tags:ajlqswyKS2");
      }
    }
    cmd.params.push("menu:1");
    cmd.params.push("library_id:-1");
    return __spreadValues({}, cmd);
  }

  // ../package.json
  var version = "2.0.0-alpha.1";

  // squeezeboxrpc/js/textImage.js
  String.prototype.regexIndexOf = function(regex, startpos) {
    const indexOf = this.substring(startpos || 0).search(regex);
    return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
  };
  function wordwrap(str, width, opt) {
    opt = opt || {};
    const splitChars = [" ", "-", "	"];
    if (opt.wrapCamelCase) {
      str = str.replace(/([a-z])([A-Z])/gm, "$1 $2");
    }
    const words = explode(str, splitChars);
    let curLineLength = 0;
    let strBuilder = "";
    for (let i = 0; i < words.length; i += 1) {
      let word = words[i];
      if (curLineLength + word.length > width) {
        if (curLineLength > 0) {
          strBuilder += "\n";
          curLineLength = 0;
        }
        while (word.Length > width) {
          strBuilder += `${word.substring(0, width - 1)}-`;
          word = word.substring(width - 1);
          strBuilder += "\n";
        }
        word = word.trimStart();
      }
      if (curLineLength == 0 && /^\s+$/.test(word)) {
        word = word.trimStart();
      }
      strBuilder += word;
      curLineLength += word.length;
    }
    return strBuilder;
  }
  function explode(str) {
    const parts = [];
    let startIndex = 0;
    while (true) {
      const index = str.regexIndexOf(/[ |\t|-]/gm, startIndex);
      if (index == -1) {
        parts.push(str.substring(startIndex));
        return parts;
      }
      const word = str.substring(startIndex, startIndex + index - startIndex);
      const nextChar = str.substring(index, index + 1)[0];
      if (/^\s+$/.test(nextChar)) {
        parts.push(word);
        parts.push(nextChar);
      } else {
        parts.push(word + nextChar);
      }
      startIndex = index + 1;
    }
  }
  var getTextHeight = function(font) {
    const text = $("<span>Hg</span>").css({ font: font.getfont() });
    const block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
    const div = $("<div></div>");
    div.append(text, block);
    const body = $("body");
    body.append(div);
    const result = {};
    try {
      block.css({ verticalAlign: "baseline" });
      result.ascent = block.offset().top - text.offset().top;
      block.css({ verticalAlign: "bottom" });
      result.height = block.offset().top - text.offset().top;
      result.descent = result.height - result.ascent;
    } finally {
      div.remove();
    }
    return result;
  };
  function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font.getfont();
    const metrics = context.measureText(text);
    return metrics.width;
  }
  var Font = class {
    /**
     * Creates a Font object for the given element.
     *
     * @param elem the element to get the font string from
     */
    constructor(elem) {
      this.span = document.createElement("span");
      const fontstr = this.getFontString(elem[0]);
      this.span.style.font = fontstr;
      this.measure = getTextHeight(this);
      this.measure.width = getTextWidth("M", this);
    }
    /**
     * Retrieves the ascent value of the font.
     *
     * @returns {number} The ascent value of the font.
     */
    getAscent() {
      return this.measure.ascent;
    }
    /**
     * Retrieves the descent value of the font.
     *
     * @returns {number} The descent value of the font.
     */
    getDescent() {
      return this.measure.descent;
    }
    /**
     * Retrieves the width of the font.
     *
     * @returns {number} The width of the font.
     */
    getWidth() {
      return this.measure.width;
    }
    /**
     * Retrieves the height value of the font.
     *
     * @returns {number} The height value of the font.
     */
    getHeight() {
      return this.measure.height;
    }
    /**
     * Returns the current font string for the font.
     *
     * @returns The current font string.
     */
    getfont() {
      return this.span.style.font;
    }
    /**
     * Set the font string for the font.
     *
     * @param fontstr the new font string
     * @returns The Font object, to allow chaining.
     */
    setfont(fontstr) {
      this.span.style.font = fontstr;
      return this;
    }
    /**
     * Increase the font size of the font by one pixel.
     *
     * @returns The Font object, to allow chaining.
     */
    incFontSize() {
      this.span.style.fontSize = `${parseInt(this.span.style.fontSize) + 1}px`;
      return this;
    }
    /**
     * Decrease the font size of the font by one pixel.
     *
     * @returns The Font object, to allow chaining.
     */
    decFontSize() {
      this.span.style.fontSize = `${parseInt(this.span.style.fontSize) - 1}px`;
      return this;
    }
    /**
     * Given an element, returns the CSS font string for that element.
     *
     * @param elem - The element to get the font string for.
     * @returns The CSS font string, or 'normal 12px sans-serif' if no font style is set.
     */
    getFontString(elem) {
      const style = window.getComputedStyle(elem);
      let elementFont = style.getPropertyValue("font");
      if (elementFont) {
        return elementFont;
      }
      const fontStyle = style.getPropertyValue("font-style");
      const fontVariant = style.getPropertyValue("font-variant");
      const fontWeight = style.getPropertyValue("font-weight");
      const fontSize = style.getPropertyValue("font-size");
      const fontFamily = style.getPropertyValue("font-family");
      elementFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`.replace(/ +/g, " ").trim();
      return elementFont ? elementFont : "normal 12px sans-serif";
    }
  };
  function getEffectiveBackgroundColor(element, fallback = "#000000") {
    for (let current = element; current; current = current.parentElement) {
      const backgroundColor = window.getComputedStyle(current).backgroundColor;
      if (backgroundColor && backgroundColor != "transparent" && backgroundColor != "rgba(0, 0, 0, 0)" && backgroundColor != "rgba(0,0,0,0)") {
        return backgroundColor;
      }
    }
    return fallback;
  }
  function resolveLegacyDefaultColor(configured, legacyDefault, inherited) {
    if (!configured || configured.toLowerCase() == legacyDefault.toLowerCase()) {
      return inherited;
    }
    return configured;
  }
  function getGoodFontSize(lines, picWidth, font) {
    while (true) {
      const maxWidth = getMaxPixelWidth(lines, font);
      if (maxWidth > picWidth) {
        font.decFontSize();
      } else {
        return font;
      }
    }
  }
  function createCanvas(lines, font, picWidth, picHeight, lineHeight, opt) {
    opt = opt || {};
    const canvas = document.createElement("canvas");
    $("body").append(canvas);
    canvas.width = picWidth;
    canvas.height = picHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = opt.style ? opt.backgroundcolor : "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font.getfont();
    ctx.fillStyle = opt.style ? opt.style.color : "white";
    ctx.textAlign = opt.style ? opt.style.textAlign : "center";
    let x = 0;
    if (opt.style) {
      if (opt.style.direction == "ltr") {
        if (opt.style.textAlign == "start" || opt.style.textAlign == "left") {
          x = 0;
        }
        if (opt.style.textAlign == "end" || opt.style.textAlign == "right") {
          x = picWidth;
        }
        if (opt.style.textAlign == "center") {
          x = picWidth / 2;
        }
      }
      if (opt.style.direction == "rtl") {
        if (opt.style.textAlign == "end" || opt.style.textAlign == "left") {
          x = 0;
        }
        if (opt.style.textAlign == "start" || opt.style.textAlign == "right") {
          x = picWidth;
        }
        if (opt.style.textAlign == "center") {
          x = picWidth / 2;
        }
      }
    } else {
      x = picWidth / 2;
    }
    const y = font.getDescent() + Math.floor((picHeight - lines.length * lineHeight) / 2);
    ctx.textBaseline = "top";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineHeight);
    }
    return canvas;
  }
  function getMaxChars(lines) {
    return lines.reduce(
      function(acc, cur) {
        return Math.max(acc, cur.length);
      }.bind(this),
      0
    );
  }
  function getMaxPixelWidth(lines, font) {
    return lines.reduce(
      function(acc, cur) {
        return Math.max(acc, getTextWidth(cur.trim(), font));
      }.bind(this),
      0
    );
  }
  function createTextImage(text, font, picWidth, picHeight, opt) {
    opt = opt || {};
    font = typeof font == "string" ? new Font(font) : font;
    const lineHeight = font.getHeight();
    const charWidth = font.getWidth();
    const maxChars = picWidth / charWidth;
    let maxLines = picHeight / lineHeight - 1;
    maxLines = maxLines < 0 ? 1 : maxLines;
    let lines;
    if (picHeight >= picWidth) {
      for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && maxLines + 1 < lines.length; textWidth++) {
      }
    } else {
      for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && getMaxChars(lines) < maxChars && lines.length > 1; textWidth++) {
      }
    }
    const goodFont = getGoodFontSize(lines, picWidth, font);
    return createCanvas(lines, goodFont, picWidth, picHeight, lineHeight, opt);
  }

  // squeezeboxrpc/js/widgets/browser.js
  var browser = {
    topitems: [
      {
        title: "My Music",
        actions: JSON.stringify({ next: "mymusic" }),
        id: "myMusic"
      },
      {
        title: "Radio",
        actions: JSON.stringify({ next: "radio" }),
        id: "radio"
      },
      {
        title: "Favorites",
        actions: JSON.stringify({ next: "favorites" }),
        id: "favorites"
      },
      {
        title: "Apps",
        actions: JSON.stringify({ next: "apps" }),
        id: "apps"
      },
      {
        title: "Extra",
        actions: JSON.stringify({ next: "extra" }),
        id: "extra"
      }
    ],
    specialRangeHandling: [
      {
        mode: "mode:floptracks",
        range: [0, 200]
      },
      {
        mode: "mode:toptracks",
        range: [0, 200]
      }
    ],
    indexParam: [0, 25e3],
    info: {},
    createWidget: function(widgetID, view, data, style) {
      return __async(this, null, function* () {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
          return setTimeout(function() {
            vis.binds["squeezeboxrpc"].browser.createWidget(widgetID, view, data, style);
          }, 100);
        }
        if (!this.info[widgetID]) {
          this.info[widgetID] = {
            history: [],
            data,
            style,
            view
          };
        }
        vis.binds["squeezeboxrpc"].debug = data.debug || false;
        vis.binds["squeezeboxrpc"].fetchResults = data.debugwithFetchResults || false;
        this.info[widgetID].instance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes(
          $div,
          data.widgetPlayer
        );
        let ainstance = this.info[widgetID].instance;
        if (!ainstance) {
          return;
        }
        const playername = yield vis.binds["squeezeboxrpc"].getPlayerNameAsync(data.widgetPlayer);
        const state = `${ainstance[0]}.${ainstance[1]}.Players.${playername}.PlayerID`;
        this.info[widgetID].playerid = yield vis.binds["squeezeboxrpc"].getPlayerID(state);
        this.goDeeper(widgetID, { id: "home", title: "Home", params: null });
      });
    },
    goDeeper(widgetID, data) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`goDeeper ${widgetID}`);
        let children = yield this.fetchChildren(widgetID, data);
        if (!children) {
          vis.binds["squeezeboxrpc"].debug && console.log(`End of tree reached ${widgetID}`);
          return;
        }
        this.info[widgetID].history.push(data);
        this.render(widgetID, children);
      });
    },
    goBack(widgetID) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`goBack ${widgetID}`);
        if (this.info[widgetID].history.length > 1) {
          this.info[widgetID].history.pop();
        }
        if (this.info[widgetID].history.length == 0) {
          return;
        }
        let data = this.info[widgetID].history[this.info[widgetID].history.length - 1];
        let children = yield this.fetchChildren(widgetID, data);
        this.render(widgetID, children);
      });
    },
    fetchChildren(widgetID, data) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`fetchChildren ${widgetID}`);
        let items = {};
        switch (data.id || "") {
          case "home":
            items = this.topitems;
            break;
          case "radio":
            items = yield vis.binds["squeezeboxrpc"].browser.browseradio(widgetID, data);
            break;
          case "favorites":
            items = yield vis.binds["squeezeboxrpc"].browser.browserfavorites(widgetID, data);
            break;
          case "apps":
            items = yield vis.binds["squeezeboxrpc"].browser.browseapps(widgetID, data);
            break;
          case "myMusic":
          case "extra":
            items = yield vis.binds["squeezeboxrpc"].browser.browsemenu(widgetID, data);
            break;
          default:
            if (data.actions) {
              items = yield vis.binds["squeezeboxrpc"].browser.browseparametermenu(widgetID, data);
            }
            break;
        }
        if (!items) {
          return;
        }
        return items.filter((el) => el);
      });
    },
    browseapps: function(widgetID) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`browseapps ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
          playerid: this.info[widgetID].playerid,
          cmdArray: ["myapps", "items", 0, "25000", "menu:1"]
        };
        let request = yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
      });
    },
    browseradio: function(widgetID) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`browseradio ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
          playerid: this.info[widgetID].playerid,
          cmdArray: ["radios", 0, "25000", "menu:radio"]
        };
        let request = yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
      });
    },
    browserfavorites: function(widgetID) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`browserfavorites ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
          playerid: this.info[widgetID].playerid,
          cmdArray: ["favorites", "items", 0, "25000", "menu:favorites"]
        };
        let request = yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
      });
    },
    browsemenu: function(widgetID, data) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`browsemenu ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const data1 = {
          playerid: this.info[widgetID].playerid,
          cmdArray: ["menu", "items", 0, "25000", "direct:1"]
        };
        let request = yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", data1);
        let filter = (item) => item.item.node === data.id;
        let menu = parseRequestFactory(request);
        return menu.getMenuItems().filter(filter).sort((a, b) => a.item.weight - b.item.weight);
      });
    },
    browseparametermenu: function(widgetID, data) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`browseparametermenu ${widgetID}`);
        let parameter = JSON.parse(data.actions)["next"];
        let ainstance = this.info[widgetID].instance;
        let range = [...this.indexParam];
        if (parameter.params) {
          this.specialRangeHandling.forEach((item) => {
            if (parameter.params.includes(item.mode)) {
              range = item.range;
            }
          });
        }
        const cmd = {
          playerid: this.info[widgetID].playerid,
          cmdArray: [...parameter.command, ...range, ...parameter.params]
        };
        let request = yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
      });
    },
    clickhandler: function(event, widgetID, func, id) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`clickhandler ${widgetID} ${func} ${id}`);
        let child;
        event.preventDefault();
        event.stopPropagation();
        if (id) {
          child = this.info[widgetID].currentChildren.find((c) => c.id == id);
        }
        if (func == "next") {
          yield this.goDeeper(widgetID, child);
        } else if (func == "back") {
          yield this.goBack(widgetID);
          return;
        } else {
          yield this.doAction(widgetID, child, func, id);
          return;
        }
      });
    },
    doAction: function(widgetID, child, func) {
      return __async(this, null, function* () {
        vis.binds["squeezeboxrpc"].debug && console.log(`doAction`);
        let actions = JSON.parse(child.actions);
        let parameter = actions[func];
        let ainstance = this.info[widgetID].instance;
        const cmd = {
          playerid: this.info[widgetID].playerid,
          cmdArray: [...parameter.command, ...parameter.params]
        };
        yield vis.binds["squeezeboxrpc"].browsesendToAsync(ainstance.join("."), "cmdGeneral", cmd);
      });
    },
    render(widgetID, children) {
      vis.binds["squeezeboxrpc"].debug && console.log(`render ${widgetID}`);
      let backTitle = "--";
      backTitle = this.info[widgetID].history.reduce((acc, val, i) => `${acc} ${i == 0 ? "" : "/"} ${val.title}`, "");
      const font = new Font($(`#${widgetID}`));
      let textwidth = getTextWidth(`...${backTitle}`, font);
      let widgetwidth = $(`#${widgetID}`).width();
      this.info[widgetID].currentChildren = children;
      let text = "";
      text += `
            <style>
                /* Grundlegendes Layout der Listen-Container */
                 #${widgetID} .sqbrowser-list-container {
                    width: 100%;
                    // max-width: 600px; /* Beispiel: feste max-Breite */
                    margin: 0 auto; /* zentriert auf der Seite */
                    box-sizing: border-box;
                }
                #${widgetID} .sqbrowser-parent-directory {
                    position: sticky;          /* "Klebt" an einer definierten Position */
                    top: 0;                    /* Fixiert oben im Container */
                    padding: 0rem 0rem;
                    z-index: 10;               /* Damit sie auch oben bleibt, falls andere Elemente dar\xFCberliegen k\xF6nnten */
                    border-bottom: 1px solid #ccc;
                    /* background-color: black; */
                    cursor: pointer;
                }
                #${widgetID} .sqbrowser-ellipsis {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    direction: rtl;
                    overflow: hidden;
                }
                #${widgetID} .sqbrowser-scrollable-area {
                    /* Hier legen wir die H\xF6he fest, ab der gescrollt werden soll */
                    /* max-height: 300px; */         /* Beispiel: 300px */
                    overflow-y: auto;          /* Vertikales Scrollen bei \xDCberlauf */
                    padding: 0 0rem;
                }
                /* Einzelne List-Items */
                #${widgetID} .sqbrowser-list-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.2rem;
                    margin: 0.2rem 0;
                    // background-color: #f8f8f8;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    z-index: 1;
                }

                #${widgetID} .sqbrowser-list-item[onclick] {
                    cursor: pointer; /* signalisiert, dass klickbar ist */
                }

                /* Der Text-Bereich innerhalb eines List-Items */
                #${widgetID} .sqbrowser-list-item-content {
                    flex: 1; /* soll den verf\xFCgbaren Platz f\xFCllen */
                    margin-right: 1rem; /* Abstand zu den Buttons */
                    white-space: nowrap; /* verhindert Zeilenumbruch */
                    overflow: hidden; /* versteckt \xFCberflie\xDFenden Text */
                    text-overflow: ellipsis; /* f\xFCgt \u201E...\u201C ein, wenn Text nicht passt */
                }

                /* Button-Gruppe auf der rechten Seite */
                 #${widgetID} .sqbrowser-button-group {
                    display: flex;
                    align-items: center;
                }

                /* Die Buttons selbst */
                 #${widgetID} .sqbrowser-action-btn {
                    margin-left: 0.2rem;
                    padding: 0.1rem 0.2rem;
                    cursor: pointer;
                    border: 1px solid #666;
                    background-color: #eee;
                    border-radius: 3px;
                    font-size: 1rem;
                }
                 #${widgetID} svg:active { 
                    transform: scale(0.8, 0.8);
                    transform-origin: 50% 50%;
                }

                /* Drei-Punkte-Button standardm\xE4\xDFig ausgeblendet, 
                nur sichtbar werden, wenn nicht genug Platz f\xFCr Button2 ist */
                #${widgetID} .sqbrowser-more-btn {
                    display: none; /* wird per Media Query eingeblendet */
                }
                #${widgetID} .sqbrowser-btn-svg {
                    width: 1rem;
                    height: 1rem;
                    margin: 0px 1px;
                    cursor: pointer;
                }
                #${widgetID} .sqbrowser-btn-svg-action {
                    border: 1px solid white;
                }
                #${widgetID} .sqbrowser-btn-svg-menu {
                    display: inline-block;
                    vertical-align: middle;
                    height: fit-content;
                }
                    </style>
            `;
      text += ` 
            <div class="sqbrowser-list-container">
                <div class="sqbrowser-parent-directory ${textwidth - 10 > widgetwidth ? "sqbrowser-ellipsis" : ""}" onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', 'back')">
                    <div class="sqbrowser-btn-svg sqbrowser-btn-svg-menu">
                        ${vis.binds["squeezeboxrpc"].svg.menuback}
                    </div>
                    <span>${backTitle}</span>
                </div>
                <div class="sqbrowser-scrollable-area">
            `;
      for (let i = 0; i < children.length; i++) {
        let buttons;
        if (children[i].actions) {
          buttons = JSON.parse(children[i].actions);
        }
        let click = "";
        if (buttons && buttons.next) {
          click = children[i].actions ? `onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', 'next','${children[i].id}')"` : ``;
        }
        text += /* html */
        `
                    <div
                        class="sqbrowser-list-item"
                        ${click}
                    >
                        <div class="sqbrowser-list-item-content">${children[i].title}</div>
                        <div class="sqbrowser-button-group">
            `;
        if (buttons) {
          let actions = [
            { id: "next", svg: "next" },
            { id: "play", svg: "play" },
            { id: "add", svg: "add" }
          ];
          for (let action = 0; action < actions.length; action++) {
            if (buttons[actions[action].id]) {
              text += `
                            <div class="sqbrowser-btn-svg sqbrowser-btn-svg-action" onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', '${actions[action].id}','${children[i].id}')">
                                ${vis.binds["squeezeboxrpc"].svg[actions[action].svg]}
                            </div>
                            `;
            }
          }
        }
        text += `                         
                        </div>
                    </div>
                `;
      }
      text += /* html */
      `
                </div></div>
            `;
      $(`#${widgetID}`).html(text);
    },
    parseResult: function(request, filter, rootmenu) {
      var _a;
      vis.binds["squeezeboxrpc"].debug && console.log(`parseResult`);
      let result = request.result;
      if (result.years_loop) {
        let items = result.years_loop;
        return items.map((item) => {
          return {
            id: item.year,
            title: `${item.year}`,
            type: "years",
            favorites_url: item.facorites_url,
            rootmenu
          };
        });
      }
      if (result.works_loop) {
        let items = result.works_loop;
        return items.map((item) => {
          return {
            id: `work_id:${item.work_id}`,
            title: `${item.favorites_title}`,
            type: "work",
            favorites_url: item.facorites_url,
            albumid: item.album_id,
            composer: item.composer,
            composer_id: item.composer_id,
            work: item.work,
            rootmenu
          };
        });
      }
      if (result.genres_loop) {
        let items = result.genres_loop;
        return items.map((item) => {
          return {
            id: item.id,
            title: `${item.genre}`,
            type: "genre",
            favorites_url: item.facorites_url,
            rootmenu
          };
        });
      }
      if (result.albums_loop) {
        let items = result.albums_loop;
        return items.map((item) => {
          return {
            id: item.id,
            title: `${item.artist} / ${item.album} (${item.year})`,
            image: `/music/${item.artwork_track_id}/cover_300x300_f`,
            type: "album",
            favorites_url: item.facorites_url,
            rootmenu
          };
        });
      }
      if (result.artists_loop) {
        let items = result.artists_loop;
        return items.map((item) => {
          return {
            id: item.id,
            title: item.artist,
            image: `/imageproxy/mai/artist/${item.id}/image_300x300_f`,
            type: "artist",
            favorites_url: item.favorites_url,
            rootmenu
          };
        });
      }
      if (result.item_loop) {
        let items = result.item_loop;
        const style = ((_a = result.window) == null ? void 0 : _a.windowStyle) || "";
        if (filter) {
          items = items.filter(filter);
        }
        if (rootmenu == "myMusic" && style == "icon_list") {
          return items.map((item) => {
            return {
              id: item.commonParams.track_id,
              type: "track",
              title: item.text.replace("\n", " - "),
              icon: item.icon,
              rootmenu
            };
          });
        }
        if (rootmenu == "myMusic" && (style == "text_list" || style == "home_menu")) {
          return items.map((item) => {
            if (item.type == "audio") {
              return {
                id: item.params.item_id,
                type: "track",
                title: item.text.replace("\n", " - "),
                icon: null,
                rootmenu
              };
            }
            if (item.type == "playlist") {
              let cmd = {
                command: ["browselibrary", "items"],
                params: ["menu:browselibrary", "mode:bmf", ...this.object2Array(item.params)]
              };
              return {
                id: item.params.item_id,
                type: "playlist",
                title: `(D) ${item.text.replace("\n", " - ")}`,
                param: JSON.stringify(cmd),
                icon: null,
                rootmenu
              };
            }
          });
        }
        if (style == "" && rootmenu == "myMusic") {
          items = items.sort((a, b) => a.weight - b.weight);
          return items.map((item) => {
            return {
              id: item.id,
              type: "menu",
              title: item.text,
              param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
              icon: item.icon,
              rootmenu
            };
          });
        }
        if (style == "" && rootmenu == "radio") {
          items = items.sort((a, b) => a.weight - b.weight);
          return items.map((item) => {
            return {
              id: item.text,
              type: "radio",
              title: item.text,
              param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
              icon: item.icon,
              rootmenu
            };
          });
        }
        if (rootmenu == "radio" && style == "text_list") {
          return items.map((item) => {
            return {
              id: item.text,
              type: "radio",
              title: item.text.replace("\n", " - "),
              param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
              icon: null,
              rootmenu
            };
          });
        }
        if (rootmenu == "radio" && style == "icon_list") {
          return items.map((item) => {
            return {
              id: item.params.item_id,
              type: "track",
              title: item.text.replace("\n", " - "),
              icon: item.icon,
              rootmenu
            };
          });
        }
      }
    },
    object2Array: function(obj) {
      return Object.keys(obj).map(function(key) {
        return `${key}:${obj[key]}`;
      });
    }
  };

  // squeezeboxrpc/js/itemConfiguration.js
  function normalizeItem(item) {
    const id = String((item == null ? void 0 : item.id) || "").trim();
    return id ? {
      id,
      enabled: item.enabled !== false,
      text: String(item.text || ""),
      image: String(item.image || "")
    } : null;
  }
  function parseItemConfiguration(value) {
    if (!value) {
      return null;
    }
    try {
      const parsed = typeof value == "string" ? JSON.parse(value) : value;
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) {
        return null;
      }
      const items = [];
      parsed.items.forEach((item) => {
        const normalized = normalizeItem(item);
        if (normalized && !items.some((existing) => existing.id == normalized.id)) {
          items.push(normalized);
        }
      });
      return {
        version: 1,
        defaultId: String(parsed.defaultId || ""),
        items
      };
    } catch (e) {
      return null;
    }
  }
  function serializeItemConfiguration(configuration) {
    return JSON.stringify({
      version: 1,
      defaultId: String(configuration.defaultId || ""),
      items: configuration.items.map(normalizeItem).filter(Boolean)
    });
  }
  function mergeConfiguredItems(configuration, discoveredItems) {
    const discovered = new Map(
      discoveredItems.map((item) => {
        const source = typeof item == "string" ? { id: item } : item;
        const normalized = normalizeItem(source);
        return normalized ? __spreadValues(__spreadValues({}, source), normalized) : null;
      }).filter(Boolean).map((item) => [item.id, item])
    );
    const result = ((configuration == null ? void 0 : configuration.items) || []).map((item) => {
      const remote = discovered.get(item.id);
      discovered.delete(item.id);
      return __spreadProps(__spreadValues(__spreadValues({}, remote), item), {
        discoveredImage: (remote == null ? void 0 : remote.image) || "",
        available: !!remote
      });
    });
    discovered.forEach((item) => result.push(__spreadProps(__spreadValues({}, item), { enabled: true, available: true })));
    return result;
  }
  function visibleConfiguredItems(configuration, discoveredItems) {
    return mergeConfiguredItems(configuration, discoveredItems).filter(
      (item) => item.enabled !== false && item.available
    );
  }
  function legacyList(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }
  function legacyPlayerConfiguration(data, playerNames) {
    var _a;
    const configuredIndices = legacyList(data.viewindex);
    const orderedIndices = configuredIndices.length ? configuredIndices : playerNames.map((_, index) => String(index));
    const enabled = new Set(orderedIndices);
    const items = [];
    orderedIndices.forEach((value) => {
      const index = Number(value);
      if (Number.isInteger(index) && playerNames[index] !== void 0 && !items.some((item) => item.id == playerNames[index])) {
        items.push({
          id: playerNames[index],
          enabled: true,
          text: String(data[`buttonsText${index + 1}`] || ""),
          image: String(data[`buttonsImage${index + 1}`] || "")
        });
      }
    });
    playerNames.forEach((id, index) => {
      if (!items.some((item) => item.id == id)) {
        items.push({
          id,
          enabled: !configuredIndices.length || enabled.has(String(index)),
          text: String(data[`buttonsText${index + 1}`] || ""),
          image: String(data[`buttonsImage${index + 1}`] || "")
        });
      }
    });
    const defaultIndex = Number(data.defaultPlayer);
    const defaultId = playerNames[defaultIndex] || String(data.defaultPlayer || "") || ((_a = items[0]) == null ? void 0 : _a.id) || "";
    return { version: 1, defaultId, items };
  }
  function legacyFavoriteConfiguration(data, favorites2) {
    const discoveredIds = favorites2.map((favorite) => favorite.id);
    const configuredIds = legacyList(data.viewindex);
    const orderedIds = configuredIds.length ? configuredIds : discoveredIds;
    const items = [];
    orderedIds.forEach((id, position) => {
      const favorite = favorites2.find((item) => item.id == id);
      if (favorite && !items.some((item) => item.id == id)) {
        items.push({
          id,
          enabled: true,
          text: String(data[`buttonsText${position + 1}`] || ""),
          image: String(data[`buttonsImage${position + 1}`] || "")
        });
      }
    });
    favorites2.forEach((favorite) => {
      if (!items.some((item) => item.id == favorite.id)) {
        items.push({ id: favorite.id, enabled: false, text: "", image: "" });
      }
    });
    return { version: 1, defaultId: "", items };
  }
  function moveConfiguredItem(items, index, offset) {
    const target = index + offset;
    if (index < 0 || target < 0 || index >= items.length || target >= items.length) {
      return items;
    }
    const result = items.slice();
    const [item] = result.splice(index, 1);
    result.splice(target, 0, item);
    return result;
  }

  // squeezeboxrpc/js/widgets/favorites.js
  var favorites = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].favorites.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = __spreadValues(__spreadValues({}, vis.views[view].widgets[widgetID].data), data || {});
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      const key = `${ainstance[0]}.${ainstance[1]}.Favorites.*`;
      vis.conn.gettingStates = 0;
      vis.conn.getStates(
        key,
        function(err, obj) {
          let favorites2 = this.getFavorites(obj, ainstance);
          favorites2 = this.filterFavorites(favorites2);
          const configuration = parseItemConfiguration(data.favoriteConfiguration) || legacyFavoriteConfiguration(data, favorites2);
          const configuredFavorites = visibleConfiguredItems(configuration, favorites2);
          const editmodehelper = data.editmodehelper;
          const picWidth = data.picWidth;
          const picHeight = data.picHeight;
          const opacity = vis.editMode && editmodehelper ? 1 : data.opacity;
          const borderwidth = data.borderwidth;
          const borderstyle = data.borderstyle;
          const bordercolornormal = data.bordercolornormal;
          const bordercoloractive = data.bordercoloractive;
          const borderradius = data.borderradius;
          const buttonmargin = data.buttonmargin || "0px";
          let text = "";
          text += "<style>\n";
          text += `#${widgetID} div {
`;
          text += "     display: inline-block; \n";
          text += "}\n";
          text += `#${widgetID} div div {
`;
          text += "     position: relative; \n";
          text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
          text += "}\n";
          text += `#${widgetID} #${widgetID}container {
`;
          text += "    box-sizing: border-box;\n";
          text += "    display: block;\n";
          text += "    width: 100%;\n";
          text += "    height: 100%;\n";
          text += "    overflow: auto;\n";
          text += "    scrollbar-width: thin;\n";
          text += "}\n";
          text += `#${widgetID} #${widgetID}container::-webkit-scrollbar {
`;
          text += "    width: 6px;\n";
          text += "    height: 6px;\n";
          text += "}\n";
          text += `#${widgetID} input[type="radio"] {
`;
          text += "    display: none;\n";
          text += "}\n";
          text += `#${widgetID} img {
`;
          text += `    opacity: ${opacity};
`;
          text += `    width: ${picWidth}px;
`;
          text += `    height: ${picHeight}px;
`;
          text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += `#${widgetID} canvas {
`;
          text += `    opacity: ${opacity};
`;
          text += `    width: ${picWidth}px;
`;
          text += `    height: ${picHeight}px;
`;
          text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += `#${widgetID} img:active {
`;
          text += "    transform: scale(0.9, 0.9);\n";
          text += "    opacity: 1;\n";
          text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += `#${widgetID} canvas:active {
`;
          text += "    transform: scale(0.9, 0.9);\n";
          text += "    opacity: 1;\n";
          text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += `#${widgetID} input[type="radio"]:checked + label img {
`;
          text += "    opacity: 1;\n";
          text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += `#${widgetID} input[type="radio"]:checked + label canvas {
`;
          text += "    opacity: 1;\n";
          text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
          text += `    border-radius: ${borderradius};
`;
          text += "}\n";
          text += "</style>\n";
          text += `<div id="${widgetID}container">`;
          for (let i = 0; i < configuredFavorites.length; i++) {
            const favorite = configuredFavorites[i];
            text += "  <div>";
            text += `    <input type="radio" id="${widgetID}${favorite.id}" name="${widgetID}" value="${favorite.id}" >`;
            text += `    <label for="${widgetID}${favorite.id}">`;
            text += "      <span>";
            let favimage = favorite.image || favorite.discoveredImage || "";
            let favtext = favorite.id || "";
            let attrimage = favorite.image || "";
            let attrtext = favorite.text || "";
            favimage = favimage.trim();
            favtext = favtext.trim();
            attrimage = attrimage.trim();
            attrtext = attrtext.trim();
            const buttonsImage = attrimage || favimage;
            if (!attrtext && buttonsImage) {
              text += `        <img src="${buttonsImage}">`;
            }
            text += "      </span>";
            text += "    </label>";
            if (vis.editMode && editmodehelper) {
              text += `<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;">${favorite.id}</div>`;
            }
            text += "  </div>";
          }
          text += "</div>";
          $(`#${widgetID}`).html(text);
          const spans = $(`#${widgetID} span`);
          const font = new Font($(`#${widgetID}`));
          const opt = {};
          const computedStyle = window.getComputedStyle($(`#${widgetID}`)[0], null);
          opt.style = {
            color: (style == null ? void 0 : style.color) || "#ffffff",
            direction: computedStyle.direction,
            textAlign: computedStyle.textAlign || "center"
          };
          opt.backgroundcolor = data.buttonbkcolor || "#000000";
          for (let i = 0; i < configuredFavorites.length; i++) {
            const favorite = configuredFavorites[i];
            let favimage = favorite.image || favorite.discoveredImage || "";
            let favtext = `${favorite.id || ""}(${i})`;
            let attrimage = favorite.image || "";
            let attrtext = favorite.text || favorite.name || "";
            favimage = favimage.trim();
            favtext = favtext.trim();
            attrimage = attrimage.trim();
            attrtext = attrtext.trim();
            const buttonsImage = attrimage || favimage;
            const buttonsText = attrtext || favtext;
            if (attrtext || !buttonsImage) {
              $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
            }
          }
          const favbtns = $(`input[name=${widgetID}]`);
          favbtns.off("change.favorite").on("change.favorite", fdata, function(event) {
            const fdata2 = event.data;
            const data2 = fdata2.data;
            const favorite = this.value;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data2.widgetPlayer);
            const state = `${ainstance[0]}.${ainstance[1]}.Players.${playername}.cmdPlayFavorite`;
            vis.setValue(state, favorite);
          });
        }.bind(this)
      );
    },
    getFavorites: function(datapoints, ainstance) {
      const regex = new RegExp(`^${ainstance[0]}\\.${ainstance[1]}\\.Favorites`, "");
      return Object.keys(datapoints).reduce(
        function(acc, cur) {
          if (regex.test(cur)) {
            const key = cur.split(".")[3];
            const name = cur.split(".")[4];
            if (!acc[key]) {
              acc[key] = {};
            }
            acc[key][name] = this[cur].val;
          }
          return acc;
        }.bind(datapoints),
        []
      );
    },
    filterFavorites: function(favorites2) {
      favorites2 = Object.values(favorites2);
      return favorites2.filter(function(cur) {
        return cur.isaudio === 1;
      });
    }
  };

  // squeezeboxrpc/js/widgets/players.js
  var players = {
    createWidget: function(widgetID, view, data, style) {
      return __async(this, null, function* () {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
          return setTimeout(function() {
            vis.binds["squeezeboxrpc"].players.createWidget(widgetID, view, data, style);
          }, 100);
        }
        data = __spreadValues(__spreadValues({}, vis.views[view].widgets[widgetID].data), data || {});
        style = vis.views[view].widgets[widgetID].style;
        data.ainstance = data.ainstance ? data.ainstance.split(".").slice(0, 2).join(".") : "";
        const ainstance = data.ainstance.split(".");
        if (ainstance[0] != "squeezeboxrpc" || !ainstance[1]) {
          $div.html("Please select an instance");
          return;
        }
        const renderPlayers = function(playerNames) {
          var _a;
          const configuration = parseItemConfiguration(data.playerConfiguration) || legacyPlayerConfiguration(data, playerNames);
          const configuredPlayers = visibleConfiguredItems(configuration, playerNames);
          const picWidth = data.picWidth;
          const picHeight = data.picHeight;
          const opacity = data.opacity;
          const borderwidth = data.borderwidth;
          const borderstyle = data.borderstyle;
          const bordercoloractive = data.bordercoloractive;
          const borderradius = data.borderradius;
          const buttonmargin = data.buttonmargin || "0px";
          const defaultPlayer = configuredPlayers.some((player) => player.id == configuration.defaultId) ? configuration.defaultId : ((_a = configuredPlayers[0]) == null ? void 0 : _a.id) || "";
          if (data.formattype == "formatselect") {
            let text = "";
            let option = "";
            option += '<option value=""></option>';
            for (let i = 0; i < configuredPlayers.length; i++) {
              const buttonsText = configuredPlayers[i].text || configuredPlayers[i].id;
              option += `<option value="${configuredPlayers[i].id}" ${configuredPlayers[i].id == defaultPlayer ? "selected" : ""}>${buttonsText}</option>`;
            }
            text += `<select type="text" id="${widgetID}select">${option}</select>`;
            $(`#${widgetID}`).html(text);
          }
          if (data.formattype == "formatbutton") {
            const widgetElement = $div[0];
            const computedStyle = window.getComputedStyle(widgetElement, null);
            const foregroundColor = computedStyle.color || "#ffffff";
            const backgroundColor = resolveLegacyDefaultColor(
              data.buttonbkcolor,
              "#000000",
              getEffectiveBackgroundColor(widgetElement, "#000000")
            );
            const bordercolornormal = data.bordercolornormal;
            let text = "";
            text += "<style>\n";
            text += `#${widgetID} div {
`;
            text += "     display: inline-block; \n";
            text += "}\n";
            text += `#${widgetID} div div {
`;
            text += "     position: relative; \n";
            text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
            text += "}\n";
            text += `#${widgetID} input[type="radio"] {
`;
            text += "    display: none;\n";
            text += "}\n";
            text += `#${widgetID} label > span {
`;
            text += "    display: inline-block;\n";
            text += `    width: ${picWidth}px;
`;
            text += `    height: ${picHeight}px;
`;
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "    overflow: hidden;\n";
            text += "    vertical-align: top;\n";
            text += "}\n";
            text += `#${widgetID} img, #${widgetID} canvas {
`;
            text += "    display: block;\n";
            text += `    opacity: ${opacity};
`;
            text += `    width: ${picWidth}px;
`;
            text += `    height: ${picHeight}px;
`;
            text += "    border: 0;\n";
            text += "}\n";
            text += `#${widgetID} label > span:active {
`;
            text += "    transform: scale(0.9, 0.9);\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
            text += "}\n";
            text += `#${widgetID} label > span:active img, #${widgetID} label > span:active canvas {
`;
            text += "    opacity: 1;\n";
            text += "}\n";
            text += `#${widgetID} input[type="radio"]:checked + label > span {
`;
            text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
            text += "}\n";
            text += `#${widgetID} input[type="radio"]:checked + label > span img,
`;
            text += `#${widgetID} input[type="radio"]:checked + label > span canvas {
`;
            text += "    opacity: 1;\n";
            text += "}\n";
            text += "</style>\n";
            text += `<div id="${widgetID}container" >`;
            for (let i = 0; i < configuredPlayers.length; i++) {
              const player = configuredPlayers[i];
              text += "  <div >";
              text += `    <input type="radio" id="${widgetID}${player.id}" name="${widgetID}" value="${player.id}" ${player.id == defaultPlayer ? "checked" : ""}>`;
              text += `    <label for="${widgetID}${player.id}">`;
              text += "      <span>";
              const buttonsImage = player.image || "";
              if (buttonsImage.trim() != "") {
                text += `        <img src="${buttonsImage}">`;
              }
              text += "      </span>";
              text += "    </label>";
              text += "  </div>";
            }
            text += "</div>";
            $(`#${widgetID}`).html(text);
            const spans = $(`#${widgetID} span`);
            const font = new Font($(`#${widgetID}`));
            const opt = {};
            opt.wrapCamelCase = data.wrapcamelcase;
            opt.style = {
              color: foregroundColor,
              direction: computedStyle.direction,
              textAlign: computedStyle.textAlign || "center"
            };
            opt.backgroundcolor = backgroundColor;
            for (let i = 0; i < configuredPlayers.length; i++) {
              const buttonsImage = configuredPlayers[i].image || "";
              const buttonsText = configuredPlayers[i].text || configuredPlayers[i].id;
              if (buttonsImage.trim() == "") {
                $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
              }
            }
          }
          $(`#${widgetID}`).off("change.playerselection").on("change.playerselection", () => vis.binds.squeezeboxrpc.publishPlayerSelection(widgetID));
          vis.binds.squeezeboxrpc.publishPlayerSelection(widgetID);
          $("body").trigger("squeezeboxrpcplayerschanged", [widgetID]);
        }.bind(this);
        try {
          const playerNames = yield vis.binds["squeezeboxrpc"].sendToAsync(data.ainstance, "getPlayerNames", {});
          if (!Array.isArray(playerNames)) {
            throw new TypeError(`Invalid getPlayerNames response: ${JSON.stringify(playerNames)}`);
          }
          renderPlayers(playerNames);
        } catch (error) {
          console.error(`Cannot read player names for ${data.ainstance}:`, error);
          $div.html("Cannot read players");
        }
      });
    }
  };

  // squeezeboxrpc/js/widgets/buttonplay.js
  var buttonplay = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonplay.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.state`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      let text = "";
      text += "<style> \n";
      text += `#${widgetID} div {
`;
      text += "   display: inline-block; \n";
      text += "   width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} input[type="submit"] { 
`;
      text += "  display: none; \n";
      text += "} \n";
      text += `#${widgetID} img { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} img:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "} \n";
      text += `#${widgetID} svg { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} svg:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "  transform-origin: 50% 50%; \n";
      text += "} \n";
      text += "</style> \n";
      text += '<div class="btn"> \n';
      text += "  <div> \n";
      text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
      text += "    <span> \n";
      text += '      <img src=""> \n';
      text += "    </span> \n";
      text += "  </div> \n";
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      this.setState(fdata);
    },
    onClick: function(event) {
      const data = event.data.data;
      const widgetID = event.data.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.state`;
      let state = $(`input[name=${widgetID}]`).val();
      state = state == 1 ? 0 : 1;
      vis.setValue(stateid, state);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const svg = vis.binds["squeezeboxrpc"].svg;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonplay.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.state`;
      const state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? parseInt(vis.states[`${stateid}.val`]) : 2;
      const imagepause = data.imagepause || "";
      const imageplay = data.imageplay || "";
      const imagestop = data.imagepause || "";
      let image2 = "";
      if (state == 0) {
        image2 = imageplay || svg.play;
      }
      if (state == 1) {
        image2 = imagepause || svg.pause;
      }
      if (state == 2) {
        image2 = imagestop || svg.play;
      }
      $(`#${widgetID} input`).val(state);
      $(`#${widgetID} img`).off("click.play", this.onClick);
      $(`#${widgetID} svg`).off("click.play", this.onClick);
      if (image2.startsWith("<svg")) {
        $(`#${widgetID} span`).html(image2);
        const $g = $(`#${widgetID} svg > g`);
        if ($g.length) {
          data.fillcolor && $g.attr("fill", data.fillcolor);
          data.strokecolor && $g.attr("stroke", data.strokecolor);
          data.strokewidth && $g.attr("stroke-width", data.strokewidth);
        }
      } else {
        $(`#${widgetID} img`).attr("src", image2);
      }
      $(`#${widgetID} img`).on("click.play", fdata, this.onClick);
      $(`#${widgetID} svg`).on("click.play", fdata, this.onClick);
    }
  };

  // squeezeboxrpc/js/widgets/buttonfwd.js
  var buttonfwd = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonfwd.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const svg = vis.binds["squeezeboxrpc"].svg;
      let text = "";
      text += "<style> \n";
      text += `#${widgetID} div {
`;
      text += "   display: inline-block; \n";
      text += "   width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} input[type="submit"] { 
`;
      text += "  display: none; \n";
      text += "} \n";
      text += `#${widgetID} img { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} img:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "} \n";
      text += `#${widgetID} svg { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} svg:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "  transform-origin: 50% 50%; \n";
      text += "} \n";
      text += "</style> \n";
      text += '<div class="btn"> \n';
      text += "  <div> \n";
      text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="fwd" >`;
      text += "    <span> \n";
      text += '      <img src="widgets/squeezeboxrpc/img/fwd.png"> \n';
      text += "    </span> \n";
      text += "  </div> \n";
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      const image2 = data.imagefwd || svg.fwd;
      if (image2.startsWith("<svg")) {
        $(`#${widgetID} span`).html(image2);
        const $g = $(`#${widgetID} svg > g`);
        if ($g.length) {
          data.fillcolor && $g.attr("fill", data.fillcolor);
          data.strokecolor && $g.attr("stroke", data.strokecolor);
          data.strokewidth && $g.attr("stroke-width", data.strokewidth);
        }
      } else {
        $(`#${widgetID} img`).attr("src", image2);
      }
      $(`#${widgetID} img`).on(
        "click",
        { self: this, widgetID, view, data, style },
        this.onClick
      );
      $(`#${widgetID} svg`).on(
        "click",
        { self: this, widgetID, view, data, style },
        this.onClick
      );
    },
    onClick: function(event) {
      const data = event.data.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.btnForward`;
      const state = true;
      vis.setValue(stateid, state);
    }
  };

  // squeezeboxrpc/js/widgets/buttonrew.js
  var buttonrew = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonrew.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const svg = vis.binds["squeezeboxrpc"].svg;
      let text = "";
      text += "<style> \n";
      text += `#${widgetID} div {
`;
      text += "   display: inline-block; \n";
      text += "   width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} input[type="submit"] { 
`;
      text += "  display: none; \n";
      text += "} \n";
      text += `#${widgetID} img { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} img:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "} \n";
      text += `#${widgetID} svg { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} svg:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "  transform-origin: 50% 50%; \n";
      text += "} \n";
      text += "</style> \n";
      text += '<div class="btn"> \n';
      text += "  <div> \n";
      text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="rew" >`;
      text += "    <span> \n";
      text += '      <img src="widgets/squeezeboxrpc/img/rew.svg"> \n';
      text += "    </span> \n";
      text += "  </div> \n";
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      const image2 = data.imagerew || svg.rew;
      if (image2.startsWith("<svg")) {
        $(`#${widgetID} span`).html(image2);
        const $g = $(`#${widgetID} svg > g`);
        if ($g.length) {
          data.fillcolor && $g.attr("fill", data.fillcolor);
          data.strokecolor && $g.attr("stroke", data.strokecolor);
          data.strokewidth && $g.attr("stroke-width", data.strokewidth);
        }
      } else {
        $(`#${widgetID} img`).attr("src", image2);
      }
      $(`#${widgetID} img`).on(
        "click",
        { self: this, widgetID, view, data, style },
        this.onClick
      );
      $(`#${widgetID} svg`).on(
        "click",
        { self: this, widgetID, view, data, style },
        this.onClick
      );
    },
    onClick: function(event) {
      const data = event.data.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.btnRewind`;
      const state = true;
      vis.setValue(stateid, state);
    }
  };

  // squeezeboxrpc/js/widgets/buttonrepeat.js
  function normalizeRepeatState(value) {
    const state = Number.parseInt(String(value), 10);
    return state === 0 || state === 1 || state === 2 ? state : 0;
  }
  function nextRepeatState(value) {
    return (normalizeRepeatState(value) + 1) % 3;
  }
  var buttonrepeat = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonrepeat.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.PlaylistRepeat`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      let text = "";
      text += "<style> \n";
      text += `#${widgetID} div {
`;
      text += "   display: inline-block; \n";
      text += "   width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} input[type="submit"] { 
`;
      text += "  display: none; \n";
      text += "} \n";
      text += `#${widgetID} img { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} img:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "} \n";
      text += `#${widgetID} svg { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} svg:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "  transform-origin: 50% 50%; \n";
      text += "} \n";
      text += "</style> \n";
      text += '<div class="btn"> \n';
      text += "  <div> \n";
      text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
      text += "    <span> \n";
      text += '      <img src=""> \n';
      text += "    </span> \n";
      text += "  </div> \n";
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      this.setState({ self: this, widgetID, view, data, style });
    },
    onClick: function(event) {
      const data = event.data.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return;
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistRepeat`;
      const state = vis.states[`${stateid}.val`];
      vis.setValue(stateid, nextRepeatState(state));
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const svg = vis.binds["squeezeboxrpc"].svg;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonrepeat.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistRepeat`;
      const state = normalizeRepeatState(vis.states[`${stateid}.val`]);
      const imagerepeat0 = data.imagerepeat0 || "";
      const imagerepeat1 = data.imagerepeat1 || "";
      const imagerepeat2 = data.imagerepeat2 || "";
      const image2 = state === 1 ? imagerepeat1 || svg.repeat1 : state === 2 ? imagerepeat2 || imagerepeat0 || svg.repeat0 : imagerepeat0 || svg.repeat0;
      $(`#${widgetID} input`).val(state);
      $(`#${widgetID} img`).off("click.repeat", this.onClick);
      $(`#${widgetID} svg`).off("click.repeat", this.onClick);
      if (image2.startsWith("<svg")) {
        $(`#${widgetID} span`).html(image2);
        const $g = $(`#${widgetID} svg > g`);
        if ($g.length) {
          data.fillcolor && $g.attr("fill", data.fillcolor);
          data.strokecolor && $g.attr("stroke", data.strokecolor);
          data.strokewidth && $g.attr("stroke-width", data.strokewidth);
        }
      } else {
        $(`#${widgetID} span`).html(`<img src="${image2}">`);
      }
      $(`#${widgetID} img, #${widgetID} svg`).css("opacity", state === 0 ? "0.5" : "1");
      $(`#${widgetID} img`).on("click.repeat", fdata, this.onClick);
      $(`#${widgetID} svg`).on("click.repeat", fdata, this.onClick);
    }
  };

  // squeezeboxrpc/js/widgets/buttonshuffle.js
  var buttonshuffle = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonshuffle.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      let text = "";
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.PlaylistShuffle`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      text += "<style> \n";
      text += `#${widgetID} div {
`;
      text += "   display: inline-block; \n";
      text += "   width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} input[type="submit"] { 
`;
      text += "  display: none; \n";
      text += "} \n";
      text += `#${widgetID} img { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} img:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "} \n";
      text += `#${widgetID} svg { 
`;
      text += "  width:  100%; \n";
      text += "} \n";
      text += `#${widgetID} svg:active { 
`;
      text += "  transform: scale(0.9, 0.9); \n";
      text += "  transform-origin: 50% 50%; \n";
      text += "} \n";
      text += "</style> \n";
      text += '<div class="btn"> \n';
      text += "  <div> \n";
      text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
      text += "    <span> \n";
      text += '      <img src=""> \n';
      text += "    </span> \n";
      text += "  </div> \n";
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      this.setState({ self: this, widgetID, view, data, style });
    },
    onClick: function(event) {
      const data = event.data.data;
      const widgetID = event.data.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistShuffle`;
      let state = $(`input[name=${widgetID}]`).val();
      state = state > 1 ? 0 : parseInt(state) + 1;
      vis.setValue(stateid, state);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const svg = vis.binds["squeezeboxrpc"].svg;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].buttonshuffle.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistShuffle`;
      const state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? parseInt(vis.states[`${stateid}.val`]) : 0;
      const imageshuffle0 = data.imageshuffle0 || "";
      const imageshuffle1 = data.imageshuffle1 || "";
      const imageshuffle2 = data.imageshuffle2 || "";
      let image2 = "";
      if (state == 0) {
        image2 = imageshuffle0 || svg.shuffle0;
      }
      if (state == 1) {
        image2 = imageshuffle1 || svg.shuffle0;
      }
      if (state == 2) {
        image2 = imageshuffle2 || svg.shuffle2;
      }
      $(`#${widgetID} input`).val(state);
      $(`#${widgetID} img`).off("click.shuffle", this.onClick);
      $(`#${widgetID} svg`).off("click.shuffle", this.onClick);
      if (image2.startsWith("<svg")) {
        $(`#${widgetID} span`).html(image2);
        const $g = $(`#${widgetID} svg > g`);
        if ($g.length) {
          data.fillcolor && $g.attr("fill", data.fillcolor);
          data.strokecolor && $g.attr("stroke", data.strokecolor);
          data.strokewidth && $g.attr("stroke-width", data.strokewidth);
          if (state === 0) {
            $g.attr("opacity", ".5");
          } else {
            $g.attr("opacity", "1");
          }
        }
      } else {
        $(`#${widgetID} img`).attr("src", image2);
      }
      $(`#${widgetID} img`).on("click.shuffle", fdata, this.onClick);
      $(`#${widgetID} svg`).on("click.shuffle", fdata, this.onClick);
    }
  };

  // squeezeboxrpc/js/volumeUtils.js
  function calculateVolume(position, size, segments, calctype, reverse) {
    const safeSize = Number(size);
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    if (!Number.isFinite(safeSize) || safeSize <= 0) {
      return 0;
    }
    let safePosition = Math.min(Math.max(Number(position) || 0, 0), safeSize);
    if (reverse) {
      safePosition = safeSize - safePosition;
    }
    if (calctype === "exact") {
      return Math.round(safePosition / safeSize * 100);
    }
    const segment = Math.min(Math.floor(safePosition / (safeSize / safeSegments)), safeSegments - 1);
    return Math.round(segment / (safeSegments - 1) * 100);
  }
  function calculateActiveLevels(volume, segments) {
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    const safeVolume = Math.min(Math.max(Number(volume) || 0, 0), 100);
    return Math.round(safeVolume / (100 / (safeSegments - 1))) + 1;
  }

  // squeezeboxrpc/js/widgets/volumebar.js
  var volumebar = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].volumebar.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = {
        self: this,
        widgetID,
        view,
        data,
        style,
        ainstance
      };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.Volume`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      const calctype = data.calctype || "segstep";
      const segments = data.segments || 11;
      const position = data.position || "vertical";
      let segheight, segwidth;
      if (position == "vertical") {
        segheight = data.segheight || "100%";
        segwidth = data.segwidth || "100%";
      } else {
        segheight = data.segheight || "100%";
        segwidth = data.segwidth || "20px";
      }
      const borderwidth = data.borderwidth || "1px";
      const bordercolornormal = data.bordercolornormal || "#909090";
      const bordercoloractive = data.bordercoloractive || "#87ceeb";
      const fillcolornormal = data.fillcolornormal || "#005000";
      const fillcoloractive = data.fillcoloractive || "#00ff00";
      const reverse = data.reverse || false;
      const margin = data.margin || "1px";
      data.calctype = calctype;
      data.segments = segments;
      data.position = position;
      data.segheight = segheight;
      data.segwidth = segwidth;
      data.borderwidth = borderwidth;
      data.bordercolornormal = bordercolornormal;
      data.bordercoloractive = bordercoloractive;
      data.fillcolornormal = fillcolornormal;
      data.fillcoloractive = fillcoloractive;
      data.reverse = reverse;
      data.margin = margin;
      let text = "";
      text += "<style> \n";
      text += `    #${widgetID} .volume { 
`;
      text += "        box-sizing: border-box; \n";
      text += "        display: inline-block; \n";
      text += "        font-size:0px; \n";
      text += "        width: 100%; \n";
      text += "        height: 100%; \n";
      text += "        overflow: visible; \n";
      if (position == "horizontal") {
        text += "        white-space: nowrap; \n";
      }
      text += "    } \n";
      text += `    #${widgetID} .level { 
`;
      text += "        box-sizing: border-box; \n";
      text += "        display: inline-block; \n";
      text += `        outline: ${borderwidth} solid ${bordercolornormal}; 
`;
      if (position == "horizontal") {
        text += `        height: calc(100% - ( 2 * ${margin} )); 
`;
        text += `        width: calc((100% / ${segments}) - ( 2 * ${margin} )); 
`;
      }
      if (position == "vertical") {
        text += `        height: calc((100% / ${segments}) - ( 2 * ${margin} )); 
`;
        text += `        width: calc(100% - ( 2 * ${margin} )); 
`;
      }
      text += `        background-color: ${fillcolornormal}; 
`;
      text += `        margin: ${margin};         
`;
      text += "    } \n";
      text += `    #${widgetID} .active { 
`;
      text += `        border-color: ${bordercoloractive}; 
`;
      text += `        background-color: ${fillcoloractive}; 
`;
      text += "    } \n";
      text += "</style> \n";
      text += '<div class="volume"> \n';
      for (let i = 0; i < segments; i++) {
        text += `    <div class="level" value="${i}"></div> 
`;
      }
      text += "</div> \n";
      $(`#${widgetID}`).html(text);
      $(`#${widgetID} div.volume`).off("click.volume").on("click.volume", fdata, this.onClick);
      this.setState(fdata);
      if (vis.editMode) {
        vis.inspectWidgets(view, view);
      }
    },
    onClick: function(event) {
      const offset = $(this).offset();
      const x = event.pageX - offset.left;
      const y = event.pageY - offset.top;
      const data = event.data.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.Volume`;
      const position = data.position == "horizontal" ? x : y;
      const size = data.position == "horizontal" ? this.clientWidth : this.clientHeight;
      const state = calculateVolume(position, size, data.segments, data.calctype, data.reverse);
      vis.binds["squeezeboxrpc"].volumebar.renderState(event.data, state);
      vis.setValue(stateid, state);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].volumebar.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.Volume`;
      let state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : 0;
      if (vis.editMode) {
        state = 50;
      }
      this.renderState(fdata, state);
    },
    renderState: function(fdata, state) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const reverse = data.reverse;
      const level = calculateActiveLevels(state, data.segments);
      const selector = reverse ? `#${widgetID} div.volume > div.level:nth-last-child(-n+${level})` : `#${widgetID} div.volume > div.level:nth-child(-n+${level})`;
      $(`#${widgetID} div.volume > div.level`).removeClass("active");
      $(selector).addClass("active");
    }
  };

  // squeezeboxrpc/js/widgets/syncgroup.js
  var syncgroup = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function(fdata2) {
          const data2 = fdata2.data;
          const boundstates = [];
          const players3 = vis.binds["squeezeboxrpc"].getPlayerValues(data2.widgetPlayer);
          for (let i = 0; i < players3.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players3[i]}.PlayerID`);
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players3[i]}.SyncMaster`);
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players3[i]}.SyncSlaves`);
          }
          return boundstates;
        },
        function() {
          setTimeout(function() {
            vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
          }, 100);
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      if (vis.binds["squeezeboxrpc"].getPlayerWidgetType(view, data.widgetPlayer) == "formatselect") {
        $div.html("Only Player formattype button is supported");
        return false;
      }
      const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
      const dataplayer = vis.binds.squeezeboxrpc.getPlayerWidgetData(data.widgetPlayer);
      const picWidth = dataplayer.picWidth;
      const picHeight = dataplayer.picHeight;
      const borderwidth = data.borderwidth;
      const borderstyle = data.borderstyle;
      const bordercolornogroup = data.bordercolornogroup;
      const bordercolorowngroup = data.bordercolorowngroup;
      const bordercolorothergroup = data.bordercolorothergroup;
      const borderradius = data.borderradius;
      const buttonmargin = data.buttonmargin || "0px";
      let text = "";
      text += "<style>\n";
      text += `#${widgetID} div {
`;
      text += "     display: inline-block; \n";
      text += "}\n";
      text += `#${widgetID} div div {
`;
      text += "     position: relative; \n";
      text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
      text += "}\n";
      text += `#${widgetID} input[type="checkbox"] {
`;
      text += "    display: none;\n";
      text += "}\n";
      text += `#${widgetID} label > span {
`;
      text += "    display: inline-block;\n";
      text += `    width: ${picWidth}px;
`;
      text += `    height: ${picHeight}px;
`;
      text += `    border: ${borderwidth} ${borderstyle} ${bordercolornogroup};
`;
      text += `    border-radius: ${borderradius};
`;
      text += "    overflow: hidden;\n";
      text += "    vertical-align: top;\n";
      text += "}\n";
      text += `#${widgetID} canvas {
`;
      text += "    display: block;\n";
      text += "    opacity: 1;\n";
      text += `    width: ${picWidth}px;
`;
      text += `    height: ${picHeight}px;
`;
      text += "    border: 0;\n";
      text += "}\n";
      text += `#${widgetID} label > span:active {
`;
      text += "    transform: scale(0.9, 0.9);\n";
      text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};
`;
      text += "}\n";
      text += `#${widgetID} input[type="checkbox"]:checked + label > span {
`;
      text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};
`;
      text += "}\n";
      text += `#${widgetID} input[type="checkbox"][othergroup="true"] + label > span {
`;
      text += `    border: ${borderwidth} ${borderstyle} ${bordercolorothergroup};
`;
      text += "}\n";
      text += "</style>\n";
      text += `<div id="${widgetID}container" >`;
      let valid = false;
      for (let i = 0; i < players2.length; i++) {
        const stateid = `${data.ainstance.join(".")}.Players.${players2[i]}.PlayerID`;
        const playerid = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : "";
        valid = valid || playerid;
        text += "  <div>";
        text += `    <input type="checkbox" id="${widgetID}${players2[i]}" name="${widgetID}" playername="${players2[i]}" value="${playerid}" disabled>`;
        text += `    <label for="${widgetID}${players2[i]}">`;
        text += "      <span>";
        text += "      <canvas></canvas>";
        text += "      </span>";
        text += "    </label>";
        text += "  </div>";
      }
      if (!valid) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
        }, 100);
      }
      text += "</div>";
      $(`#${widgetID}`).html(text);
      for (let i = 0; i < players2.length; i++) {
        const source = $(`#${data.widgetPlayer} input[value="${players2[i]}"] + label span :first-child`)[0];
        const destination = $(`#${widgetID}${players2[i]} + label span canvas`)[0];
        if (!source || !destination) {
          continue;
        }
        const drawPlayerImage = function() {
          const isCanvas = source.tagName == "CANVAS";
          const width = isCanvas ? source.width : $(source).width() || source.naturalWidth || source.width;
          const height = isCanvas ? source.height : $(source).height() || source.naturalHeight || source.height;
          if (!width || !height) {
            return;
          }
          destination.width = width;
          destination.height = height;
          const context = destination.getContext("2d");
          if (isCanvas) {
            context.drawImage(source, 0, 0);
          } else {
            context.drawImage(source, 0, 0, width, height);
          }
        };
        if (source.tagName == "IMG" && !source.complete) {
          $(source).one("load.syncgroup", drawPlayerImage);
        } else {
          drawPlayerImage();
        }
      }
      const syncgroupbtns = $(`input[name=${widgetID}]`);
      syncgroupbtns.off("change.syncgroup").on("change.syncgroup", fdata, function(event) {
        const fdata2 = event.data;
        const data2 = fdata2.data;
        const self = fdata2.self;
        const syncplayer = this.value;
        const playername = vis.binds["squeezeboxrpc"].getPlayerName(data2.widgetPlayer);
        const syncplayername = $(this).attr("playername");
        let stateid;
        if (syncplayer) {
          if (!$(this).prop("checked")) {
            stateid = `${ainstance[0]}.${ainstance[1]}.Players.${syncplayername}.cmdGeneral`;
            vis.setValue(stateid, '"sync","-"');
          } else {
            stateid = `${ainstance[0]}.${ainstance[1]}.Players.${playername}.cmdGeneral`;
            vis.setValue(stateid, `"sync","${syncplayer}"`);
          }
        }
        self.setState(fdata2);
      });
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
      const syncgroups = [];
      for (let ip = 0; ip < players2.length; ip++) {
        const playername2 = players2[ip];
        const stateid12 = `${data.ainstance.join(".")}.Players.${playername2}.SyncMaster`;
        const stateid22 = `${data.ainstance.join(".")}.Players.${playername2}.SyncSlaves`;
        const state12 = vis.states[`${stateid12}.val`] || vis.states[`${stateid12}.val`] === 0 ? vis.states[`${stateid12}.val`] : "";
        const state22 = vis.states[`${stateid22}.val`] || vis.states[`${stateid22}.val`] === 0 ? vis.states[`${stateid22}.val`] : "";
        let state4 = state12.split(",").concat(state22.split(","));
        state4 = state4.filter((item) => item != "");
        if (Array.isArray(state4)) {
          if (!syncgroups.reduce(function(acc, val) {
            return state4[0] == "" || state4.length == 0 || acc || val.includes(state4[0]);
          }, false)) {
            syncgroups.push(state4);
          }
        }
      }
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].syncgroup.setState(fdata);
        }, 100);
      }
      const stateid1 = `${data.ainstance.join(".")}.Players.${playername}.SyncMaster`;
      const stateid2 = `${data.ainstance.join(".")}.Players.${playername}.SyncSlaves`;
      const stateid3 = `${data.ainstance.join(".")}.Players.${playername}.PlayerID`;
      const state1 = vis.states[`${stateid1}.val`] || vis.states[`${stateid1}.val`] === 0 ? vis.states[`${stateid1}.val`] : "";
      const state2 = vis.states[`${stateid2}.val`] || vis.states[`${stateid2}.val`] === 0 ? vis.states[`${stateid2}.val`] : "";
      const state3 = vis.states[`${stateid3}.val`] || vis.states[`${stateid3}.val`] === 0 ? vis.states[`${stateid3}.val`] : "";
      let owngroup = null;
      for (let i = 0; i < syncgroups.length; i++) {
        if (syncgroups[i].includes(state3)) {
          owngroup = i;
          break;
        }
      }
      let state = state1.split(",").concat(state2.split(","));
      state = state.filter((item) => item != "");
      for (let ip = 0; ip < players2.length; ip++) {
        const playerbutton = players2[ip];
        const playerstateid = `${data.ainstance.join(".")}.Players.${playerbutton}.PlayerID`;
        const playerid = vis.states[`${playerstateid}.val`] || vis.states[`${playerstateid}.val`] === 0 ? vis.states[`${playerstateid}.val`] : "";
        let playergroup = null;
        for (let is = 0; is < syncgroups.length; is++) {
          if (syncgroups[is].includes(playerid)) {
            playergroup = is;
            break;
          }
        }
        const $btn = $(`input[id=${widgetID}${playerbutton}]`);
        if (state.includes(playerid) && playerid !== state3) {
          $btn.prop("checked", true);
        } else {
          $btn.prop("checked", false);
        }
        if (playerid == state3) {
          $btn.prop("disabled", true);
        } else {
          $btn.prop("disabled", false);
        }
        if (playergroup != null && playergroup != owngroup) {
          $btn.attr("othergroup", true);
        } else {
          $btn.attr("othergroup", false);
        }
      }
    }
  };

  // squeezeboxrpc/js/widgets/playtime.js
  var playtime = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].playtime.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.Duration`);
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.Time`);
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.state`);
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.cmdGoTime`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      const mainbarcolor = data.mainbarcolor;
      const playtimebarcolor = data.playtimebarcolor;
      const borderwidth = data.borderwidth;
      const borderstyle = data.borderstyle;
      const bordercolor = data.bordercolor;
      const borderradius = data.borderradius;
      let text = "";
      text += "<style> \n";
      text += `#${widgetID} .playtimemain {
`;
      text += "    width: 100%;\n";
      text += "    height: 100%;\n";
      text += `    background-color: ${mainbarcolor};
`;
      text += `    border: ${bordercolor} ${borderwidth} ${borderstyle};
`;
      text += `    border-radius: ${borderradius};
`;
      text += "    overflow: hidden;\n";
      text += "}";
      text += `#${widgetID} .playtimebar {
`;
      text += "  height: 100%;\n";
      text += `  background-color: ${playtimebarcolor};
`;
      text += "}\n";
      text += "</style> \n";
      text += '<div class="playtimemain">\n';
      text += '    <div class="playtimebar"></div>\n';
      text += "</div>\n";
      $(`#${widgetID}`).html(text);
      $(`#${widgetID} div.playtimemain`).on("click.playtime", fdata, this.onClick);
      this.setState(fdata);
    },
    onClick: function(event) {
      const data = event.data.data;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      const stateid_duration = `${data.ainstance.join(".")}.Players.${playername}.Duration`;
      const stateid_gotime = `${data.ainstance.join(".")}.Players.${playername}.cmdGoTime`;
      const state_duration = vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0 ? parseInt(vis.states[`${stateid_duration}.val`]) : 0;
      const clickx = event.offsetX;
      const width = $(this).width();
      const time = clickx / width * state_duration;
      if (time > state_duration) {
        return;
      }
      vis.setValue(stateid_gotime, time.toString());
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].playtime.setState(fdata);
        }, 100);
      }
      const stateid_duration = `${data.ainstance.join(".")}.Players.${playername}.Duration`;
      const stateid_state = `${data.ainstance.join(".")}.Players.${playername}.state`;
      const stateid_time = `${data.ainstance.join(".")}.Players.${playername}.Time`;
      const state_duration = vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0 ? parseInt(vis.states[`${stateid_duration}.val`]) : 0;
      const state_state = vis.states[`${stateid_state}.val`] || vis.states[`${stateid_state}.val`] === 0 ? parseInt(vis.states[`${stateid_state}.val`]) : 0;
      const state_time = vis.states[`${stateid_time}.val`] || vis.states[`${stateid_time}.val`] === 0 ? parseInt(vis.states[`${stateid_time}.val`]) : 0;
      let width = state_duration == 0 ? 0 : $(`#${widgetID} div.playtimebar`).width();
      if (state_state == 2) {
        width = 0;
      }
      if (vis.editMode) {
        width = 50;
      } else if (state_duration <= 0) {
        width = 0;
      } else {
        width = Math.floor(state_time / state_duration * 100);
      }
      $(`#${widgetID} div.playtimebar`).width(`${width}%`);
    }
  };

  // squeezeboxrpc/js/widgets/string.js
  var string = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].string.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.${data.playerattribute}`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].string.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
      const state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
      const html_prepend = data.html_prepend || "";
      const html_append = data.html_append || "";
      $(`#${widgetID}`).html(html_prepend + state + html_append);
    }
  };

  // squeezeboxrpc/js/widgets/playlist.js
  var playlist = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].playlist.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      return __async(this, null, function* () {
        const data = fdata.data;
        const widgetID = fdata.widgetID;
        const $div = $(`#${widgetID}`);
        const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
        if (!playername) {
          return setTimeout(function() {
            vis.binds["squeezeboxrpc"].playlist.setState(fdata);
          }, 100);
        }
        const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
        let result = yield vis.binds["squeezeboxrpc"].getPlaylistData(ainstance.join("."));
        let playlist2 = result.result.playlists_loop;
        let text = "";
        text += `
            <style>
            #${widgetID} ul.plcontainer {
                list-style-type: none;
                padding-left: 0px;
                margin: 0px;
            }
            #${widgetID} li.plentry {
                cursor: pointer;
                height: 1em;
                margin: 5px 0px;
            }
            #${widgetID} li.plentry div {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            #${widgetID} li.plrefresh {
                width: 1em;
                height: 1em;
                margin: 5px 0px;
            }
            </style>
            `;
        text += '<ul class="plcontainer">';
        text += '<li class="plrefresh"><div><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RefreshIcon"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"></path></svg></div></li>';
        for (let i = 0; i < playlist2.length; i++) {
          let pl = playlist2[i];
          text += `<li class="plentry"><div class="pltext" data-plid="${pl.id}" data-pln="${playername}" data-ins="${ainstance.join(".")}" onclick="vis.binds.squeezeboxrpc.playlist.onclickplaylist(this,event)">${pl.playlist}</div></li>`;
        }
        text += "</ul>";
        $(`#${widgetID}`).html(text);
        $(`#${widgetID} li.refresh`).click(
          function(fdata2) {
            vis.binds.squeezeboxrpc.playlist.setState(fdata2);
          }.bind(this, fdata)
        );
      });
    },
    onclickplaylist: function(el) {
      const playlistid = el.dataset.plid || "";
      const playername = el.dataset.pln || "";
      const instance = el.dataset.ins || "";
      const stateid = `${instance}.Players.${playername}.cmdGeneral`;
      vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
    },
    onclickrefresh: function(el) {
      const playlistid = el.dataset.plid || "";
      const playername = el.dataset.pln || "";
      const instance = el.dataset.ins || "";
      const stateid = `${instance}.Players.${playername}.cmdGeneral`;
      vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
    }
  };

  // squeezeboxrpc/js/widgets/playlistdetail.js
  function parsePlaylistDetail(value) {
    let entries = value;
    if (typeof value === "string") {
      try {
        entries = JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    if (!Array.isArray(entries)) {
      return [];
    }
    return entries.map((entry, position) => {
      var _a;
      return {
        index: Number.isInteger(Number(entry == null ? void 0 : entry.index)) ? Number(entry.index) : position,
        id: String((_a = entry == null ? void 0 : entry.id) != null ? _a : position),
        title: String((entry == null ? void 0 : entry.title) || ""),
        artworkUrl: String((entry == null ? void 0 : entry.ArtworkUrl) || ""),
        artist: String((entry == null ? void 0 : entry.Artist) || ""),
        album: String((entry == null ? void 0 : entry.Album) || ""),
        duration: Number(entry == null ? void 0 : entry.Duration)
      };
    });
  }
  function formatPlaylistDuration(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "--:--";
    }
    const totalSeconds = Math.floor(seconds);
    if (totalSeconds > 99 * 3600 + 59 * 60 + 59) {
      return ">99:59:59";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const remainingSeconds = totalSeconds % 60;
    const pad = (number2) => String(number2).padStart(2, "0");
    return hours ? `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}` : `${pad(minutes)}:${pad(remainingSeconds)}`;
  }
  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function cssLength(value, fallback) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value}px`;
    }
    const text = String(value || fallback).trim();
    if (/^\d+(?:\.\d+)?$/.test(text)) {
      return `${text}px`;
    }
    return /^\d+(?:\.\d+)?(?:px|em|rem|%)$/.test(text) ? text : fallback;
  }
  var playlistdetail = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(
          () => vis.binds.squeezeboxrpc.playlistdetail.createWidget(widgetID, view, data, style),
          100
        );
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds.squeezeboxrpc.checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds.squeezeboxrpc.setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        () => {
          const states = [];
          for (const player of vis.binds.squeezeboxrpc.getPlayerValues(data.widgetPlayer)) {
            states.push(`${ainstance.join(".")}.Players.${player}.Playlist`);
            states.push(`${ainstance.join(".")}.Players.${player}.PlaylistCurrentIndex`);
          }
          return states;
        },
        this.setState.bind(fdata)
      );
      vis.binds.squeezeboxrpc.setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const { data, widgetID } = fdata;
      const previousScrollTop = $(`#${widgetID} .squeezeboxrpc-playlist-detail`).scrollTop() || 0;
      const player = vis.binds.squeezeboxrpc.getPlayerName(data.widgetPlayer);
      if (!player) {
        return setTimeout(() => vis.binds.squeezeboxrpc.playlistdetail.setState(fdata), 100);
      }
      const base = `${data.ainstance.join(".")}.Players.${player}`;
      const entries = parsePlaylistDetail(vis.states[`${base}.Playlist.val`]);
      const currentIndex = Number(vis.states[`${base}.PlaylistCurrentIndex.val`]);
      const showThumbnail = data.showThumbnail !== false && data.showThumbnail !== "false";
      const showIndex = data.showIndex !== false && data.showIndex !== "false";
      const rowBackground = data.rowBackground || "#f5f7fa";
      const activeBackground = data.activeRowBackground || "#dbeafe";
      const border = `${cssLength(data.rowBorderWidth, "1px")} ${data.rowBorderStyle || "solid"} ${data.rowBorderColor || "#cbd5e1"}`;
      const spacing = cssLength(data.rowSpacing, "4px");
      let html = `<div class="squeezeboxrpc-playlist-detail" style="--pl-row-background:${escapeHtml(rowBackground)};--pl-active-background:${escapeHtml(activeBackground)};--pl-row-border:${escapeHtml(border)};--pl-row-spacing:${escapeHtml(spacing)}">`;
      for (const entry of entries) {
        const title = showIndex ? `${entry.index + 1}. ${entry.title}` : entry.title;
        const active = entry.index === currentIndex ? " active" : "";
        html += `<div class="squeezeboxrpc-playlist-detail-row${active}${showThumbnail ? "" : " no-thumbnail"}">`;
        if (showThumbnail) {
          html += `<div>${entry.artworkUrl ? `<img class="squeezeboxrpc-playlist-detail-thumbnail" src="${escapeHtml(entry.artworkUrl)}" alt="">` : ""}</div>`;
        }
        html += `<div class="squeezeboxrpc-playlist-detail-text"><div class="squeezeboxrpc-playlist-detail-line squeezeboxrpc-playlist-detail-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div><div class="squeezeboxrpc-playlist-detail-line" title="${escapeHtml(entry.artist)}">${escapeHtml(entry.artist)}</div><div class="squeezeboxrpc-playlist-detail-line" title="${escapeHtml(entry.album)}">${escapeHtml(entry.album)}</div></div>`;
        html += `<div class="squeezeboxrpc-playlist-detail-actions"><span class="squeezeboxrpc-playlist-detail-duration">${formatPlaylistDuration(entry.duration)}</span><div class="squeezeboxrpc-playlist-detail-buttons"><button type="button" class="squeezeboxrpc-playlist-detail-button play" data-index="${entry.index}" title="Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></button><button type="button" class="squeezeboxrpc-playlist-detail-button delete" data-index="${entry.index}" title="Delete"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg></button></div></div></div>`;
      }
      html += "</div>";
      const $widget = $(`#${widgetID}`).html(html);
      $widget.find(".squeezeboxrpc-playlist-detail").scrollTop(previousScrollTop);
      $widget.off(".playlistdetail");
      $widget.on("click.playlistdetail", ".squeezeboxrpc-playlist-detail-button.play", (event) => {
        vis.setValue(`${base}.PlaylistCurrentIndex`, String(event.currentTarget.dataset.index));
      });
      $widget.on("click.playlistdetail", ".squeezeboxrpc-playlist-detail-button.delete", (event) => {
        vis.setValue(`${base}.cmdGeneral`, `"playlist","delete","${Number(event.currentTarget.dataset.index)}"`);
      });
      $widget.on("error.playlistdetail", ".squeezeboxrpc-playlist-detail-thumbnail", (event) => {
        event.currentTarget.style.visibility = "hidden";
      });
    }
  };

  // squeezeboxrpc/js/widgets/number.js
  var number = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].number.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.${data.playerattribute}`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].number.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
      let state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
      state = parseFloat(state);
      if (state === void 0 || state === null || isNaN(state)) {
        state = 0;
      }
      if (data.digits || data.digits !== "") {
        state = state.toFixed(parseFloat(data.digits, 10));
      }
      if (data.is_tdp && data.is_tdp !== "") {
        state = state.toString().split(".");
        state[0] = state[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        state = state.join(".");
      }
      if (data.is_comma && data.is_comma !== "") {
        state = state.split(".").map((e) => e.replace(/,/g, ".")).join(",");
      }
      const html_prepend = data.html_prepend || "";
      const html_append = data.html_append || "";
      $(`#${widgetID}`).html(html_prepend + state + html_append);
    }
  };

  // squeezeboxrpc/js/widgets/datetime.js
  function formatDateTime(value, factor, format) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return "";
    }
    const multiplier = factor !== void 0 && factor !== "" ? Number(factor) : 1;
    const offset = 6e4 * (/* @__PURE__ */ new Date(0)).getTimezoneOffset();
    const date = new Date(numericValue * (Number.isFinite(multiplier) ? multiplier : 1) + offset);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    const pad = (number2) => String(number2).padStart(2, "0");
    const replacements = {
      YYYY: String(date.getFullYear()),
      YY: String(date.getFullYear()).slice(-2),
      MM: pad(date.getMonth() + 1),
      DD: pad(date.getDate()),
      hh: pad(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds())
    };
    return String(format || "hh:mm:ss").replace(/YYYY|YY|MM|DD|hh|mm|ss/g, (token) => replacements[token]);
  }
  var datetime = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].datetime.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.${data.playerattribute}`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].datetime.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
      const state = formatDateTime(vis.states[`${stateid}.val`], data.factor, data.format);
      const html_prepend = data.html_prepend || "";
      const html_append = data.html_append || "";
      $(`#${widgetID}`).html(html_prepend + state + html_append);
    }
  };

  // squeezeboxrpc/js/widgets/image.js
  var image = {
    createWidget: function(widgetID, view, data, style) {
      const $div = $(`#${widgetID}`);
      if (!$div.length) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].image.createWidget(widgetID, view, data, style);
        }, 100);
      }
      data = vis.views[view].widgets[widgetID].data;
      style = vis.views[view].widgets[widgetID].style;
      const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
      if (!ainstance) {
        return;
      }
      const fdata = { self: this, widgetID, view, data, style };
      vis.binds["squeezeboxrpc"].setPlayersChanged(
        $div,
        data.widgetPlayer,
        fdata,
        this.onChange.bind(fdata),
        function() {
          const boundstates = [];
          const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
          for (let i = 0; i < players2.length; i++) {
            boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.${data.playerattribute}`);
          }
          return boundstates;
        }
      );
      vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
      let imgstyle = "width:100%;";
      if (data.stretch) {
        imgstyle += "height:100%;";
      }
      let text = "";
      text += data.html_prepend || "";
      text += `<img style="${imgstyle}"></img> 
`;
      text += data.html_append || "";
      $(`#${widgetID}`).html(text);
      this.setState(fdata);
    },
    onChange: function() {
      this.self.setState(this);
    },
    setState: function(fdata) {
      const data = fdata.data;
      const widgetID = fdata.widgetID;
      const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
      if (!playername) {
        return setTimeout(function() {
          vis.binds["squeezeboxrpc"].image.setState(fdata);
        }, 100);
      }
      const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
      const state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
      $(`#${widgetID} img`).attr("src", state);
    }
  };

  // squeezeboxrpc/js/configurationEditor.js
  function editorContext(input) {
    var _a, _b, _c, _d;
    const wdata = $(input).data("wdata");
    const widgetID = (_a = wdata == null ? void 0 : wdata.widgets) == null ? void 0 : _a[0];
    const data = widgetID && ((_d = (_c = (_b = vis.views[wdata.view]) == null ? void 0 : _b.widgets) == null ? void 0 : _c[widgetID]) == null ? void 0 : _d.data);
    return data ? { data, widgetID } : null;
  }
  function playerWidgetData(widgetID) {
    var _a, _b, _c, _d;
    if ((_b = (_a = vis.widgets) == null ? void 0 : _a[widgetID]) == null ? void 0 : _b.data) {
      return vis.widgets[widgetID].data;
    }
    for (const view of Object.values(vis.views || {})) {
      if ((_d = (_c = view.widgets) == null ? void 0 : _c[widgetID]) == null ? void 0 : _d.data) {
        return view.widgets[widgetID].data;
      }
    }
    return null;
  }
  function playerInstance(data) {
    const value = String((data == null ? void 0 : data.ainstance) || "");
    const match = value.match(/(?:system\.adapter\.)?(squeezeboxrpc\.\d+)/);
    return match ? match[1] : "";
  }
  function getStates(pattern) {
    return new Promise((resolve, reject) => {
      vis.conn.getStates(pattern, (error, states) => error ? reject(error) : resolve(states || {}));
    });
  }
  function discover(mode, data) {
    return __async(this, null, function* () {
      if (mode == "players") {
        const instance2 = playerInstance(data);
        if (!instance2) {
          throw new Error("Please select an instance first");
        }
        const names = yield vis.binds["squeezeboxrpc"].sendToAsync(instance2, "getPlayerNames", {});
        if (!Array.isArray(names)) {
          throw new TypeError("Invalid getPlayerNames response");
        }
        return names.map((id) => ({ id }));
      }
      const referencedPlayer = playerWidgetData(data.widgetPlayer);
      const instance = playerInstance(referencedPlayer);
      if (!instance) {
        throw new Error("Please select a Players widget first");
      }
      const states = yield getStates(`${instance}.Favorites.*`);
      return vis.binds["squeezeboxrpc"].favorites.filterFavorites(vis.binds["squeezeboxrpc"].favorites.getFavorites(states, instance.split("."))).map((favorite) => ({
        id: favorite.id,
        name: favorite.Name || favorite.name || "",
        image: favorite.image || ""
      }));
    });
  }
  function makeButton(text, title, action, disabled) {
    return $('<button type="button"></button>').text(text).attr("title", title).attr("data-action", action).prop("disabled", disabled);
  }
  function selectImage(state, index) {
    const item = state.items[index];
    if (!item || !$.fm) {
      return;
    }
    const defaultPath = `/${vis.conn.namespace ? `${vis.conn.namespace}/` : ""}${vis.projectPrefix}img/`;
    $.fm(
      {
        lang: vis.language,
        defaultPath,
        path: item.image || defaultPath,
        uploadDir: `/${vis.conn.namespace ? `${vis.conn.namespace}/` : ""}`,
        fileFilter: ["gif", "png", "bmp", "jpg", "jpeg", "tif", "svg"],
        folderFilter: false,
        mode: "open",
        view: "prev",
        conn: vis.conn,
        zindex: 1001
      },
      (selected) => {
        item.image = selected.path + selected.file;
        renderEditor(state);
      }
    );
  }
  function renderEditor(state) {
    const $editor = state.editor.empty();
    const $toolbar = $('<div style="display:flex;gap:4px;margin-bottom:6px"></div>');
    $toolbar.append(makeButton("Refresh", "Reload available entries", "refresh", false));
    $toolbar.append(makeButton("Apply", "Save this configuration", "apply", false));
    $editor.append($toolbar);
    if (state.message) {
      $editor.append($('<div style="margin:4px 0;color:#b26a00"></div>').text(state.message));
    }
    const $list = $('<div style="display:flex;flex-direction:column;gap:4px"></div>');
    state.items.forEach((item, index) => {
      const $row = $(
        '<div style="display:grid;grid-template-columns:auto minmax(90px,1fr) auto auto;gap:4px;align-items:center;border:1px solid #aaa;padding:4px"></div>'
      );
      const $enabled = $('<input type="checkbox" data-action="enabled">').prop("checked", item.enabled !== false);
      const label = item.name ? `${item.id} - ${item.name}` : item.id;
      const $name = $('<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>').text(item.available === false ? `${label} (unavailable)` : label).attr("title", label);
      $row.attr("data-index", index).append($enabled, $name);
      $row.append(makeButton("Up", "Move up", "up", index == 0));
      $row.append(makeButton("Down", "Move down", "down", index == state.items.length - 1));
      if (state.mode == "players") {
        const $default = $('<label style="grid-column:1 / -1"></label>');
        $default.append(
          $('<input type="radio" name="squeezeboxrpc-default-player" data-action="default">').prop(
            "checked",
            state.defaultId == item.id
          ),
          document.createTextNode(" Default player")
        );
        $row.append($default);
      }
      $row.append(
        $(
          '<input type="text" data-action="text" placeholder="Optional button text" style="grid-column:1 / -1;width:100%;box-sizing:border-box">'
        ).val(item.text)
      );
      $row.append(
        $(
          '<input type="text" data-action="image" placeholder="Optional image URL" style="grid-column:1 / -2;width:100%;box-sizing:border-box">'
        ).val(item.image)
      );
      $row.append(makeButton("Select", "Select image", "image-select", false));
      $list.append($row);
    });
    $editor.append($list);
  }
  function refreshEditor(state) {
    return __async(this, null, function* () {
      var _a;
      state.message = "Loading...";
      renderEditor(state);
      try {
        const discovered = yield discover(state.mode, state.data);
        const saved = parseItemConfiguration(state.input.value);
        const legacy = state.mode == "players" ? legacyPlayerConfiguration(
          state.data,
          discovered.map((item) => item.id)
        ) : legacyFavoriteConfiguration(state.data, discovered);
        const configuration = saved || legacy;
        state.items = mergeConfiguredItems(configuration, discovered);
        state.defaultId = configuration.defaultId;
        if (!state.items.some((item) => item.id == state.defaultId && item.enabled !== false && item.available)) {
          state.defaultId = ((_a = state.items.find((item) => item.enabled !== false && item.available)) == null ? void 0 : _a.id) || "";
        }
        state.message = "";
      } catch (error) {
        state.message = error.message || String(error);
      }
      renderEditor(state);
    });
  }
  function initializeEditor(input, mode, widAttr, value) {
    input.value = typeof value == "string" ? value : "";
    const context = editorContext(input);
    const editor = $(`#inspect_${widAttr}_editor`);
    if (!context || !editor.length) {
      return;
    }
    const state = __spreadProps(__spreadValues({}, context), {
      input,
      editor,
      mode,
      items: [],
      defaultId: "",
      message: ""
    });
    editor.off(".squeezeboxrpcConfig").on("click.squeezeboxrpcConfig", "[data-action]", (event) => {
      const action = $(event.currentTarget).attr("data-action");
      const index = Number($(event.currentTarget).closest("[data-index]").attr("data-index"));
      if (action == "refresh") {
        void refreshEditor(state);
        return;
      }
      if (action == "apply") {
        input.value = serializeItemConfiguration({ version: 1, defaultId: state.defaultId, items: state.items });
        $(input).trigger("change");
        state.message = "Configuration saved";
        renderEditor(state);
        return;
      }
      if (action == "up" || action == "down") {
        state.items = moveConfiguredItem(state.items, index, action == "up" ? -1 : 1);
        renderEditor(state);
      } else if (action == "image-select") {
        selectImage(state, index);
      }
    });
    editor.on("change.squeezeboxrpcConfig input.squeezeboxrpcConfig", "[data-index] [data-action]", (event) => {
      var _a;
      const $target = $(event.currentTarget);
      const action = $target.attr("data-action");
      const index = Number($target.closest("[data-index]").attr("data-index"));
      const item = state.items[index];
      if (!item) {
        return;
      }
      if (action == "enabled") {
        item.enabled = $target.prop("checked");
        if (!item.enabled && state.defaultId == item.id) {
          state.defaultId = ((_a = state.items.find((entry) => entry.enabled !== false && entry.available)) == null ? void 0 : _a.id) || "";
          renderEditor(state);
        }
      } else if (action == "default") {
        state.defaultId = item.id;
      } else if (action == "text" || action == "image") {
        item[action] = String($target.val() || "");
      }
    });
    void refreshEditor(state);
  }
  function configurationEditor(mode, widAttr) {
    return {
      input: `<input type="hidden" id="inspect_${widAttr}"><div id="inspect_${widAttr}_editor"></div>`,
      init: function(attribute, value) {
        initializeEditor(this, mode, attribute, value);
      }
    };
  }

  // squeezeboxrpc/js/instanceSelection.js
  function normalizeSqueezeboxInstance(value) {
    const id = String((value == null ? void 0 : value._id) || (value == null ? void 0 : value.id) || value || "").replace(/^system\.adapter\./, "");
    return /^squeezeboxrpc\.\d+$/.test(id) ? id : "";
  }
  function collectSqueezeboxInstances(source) {
    const values = Array.isArray(source) ? source : Array.isArray(source == null ? void 0 : source.rows) ? source.rows.map((row) => {
      var _a;
      return ((_a = row.value) == null ? void 0 : _a._id) || row.id;
    }) : Object.entries(source || {}).map(([id, value]) => (value == null ? void 0 : value._id) || id);
    return [...new Set(values.map(normalizeSqueezeboxInstance).filter(Boolean))].sort(
      (left, right) => left.localeCompare(right, void 0, { numeric: true })
    );
  }

  // squeezeboxrpc/js/squeezeboxrpc.js
  var translations = require_translations();
  $.extend(true, systemDictionary, translations);
  vis.binds["squeezeboxrpc"] = {
    version,
    debug: false,
    fetchResults: false,
    playerSelections: {},
    showVersion: function() {
      if (vis.binds["squeezeboxrpc"].version) {
        console.log(`Version squeezeboxrpc: ${vis.binds["squeezeboxrpc"].version}`);
        vis.binds["squeezeboxrpc"].version = null;
      }
    },
    svg: {
      stop: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width=".3"><path d="m5.7393 5.4537h14.98c0.44743 0.086371 0.23662 0.63202 0.28562 0.95661v14.309c-0.08637 0.44743-0.63202 0.23662-0.95661 0.28562h-14.309c-0.44743-0.08637-0.23662-0.63202-0.28562-0.95661v-14.309c-0.00412-0.15314 0.13248-0.28973 0.28562-0.28562z"/></g></svg>',
      fwd: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path d="m5.3759 18.805c9.23e-5 -3.7545-1.846e-4 -7.509 1.385e-4 -11.263 0.13348-0.79848 1.117-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.29151-1.546-0.09983-1.6587-0.86625z"/><path d="m10.668 18.805c8.7e-5 -3.7545-1.73e-4 -7.509 1.3e-4 -11.263 0.13345-0.79849 1.1171-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.2915-1.546-0.09982-1.6587-0.86625z"/><path d="m18.876 5.3572c0.68238 0.014305 1.3705-0.02913 2.0492 0.022654 0.31228 0.23669 0.12538 0.69262 0.1764 1.0359v14.396c-0.08733 0.45287-0.63952 0.23962-0.96802 0.28916-0.45618-0.01348-0.91782 0.028-1.3703-0.02265-0.31228-0.23669-0.12538-0.69262-0.1764-1.0359v-14.396c-0.0042-0.15504 0.13412-0.29333 0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
      pause: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width=".3"><path d="m5.6838 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.00415-0.15428 0.13346-0.29188 0.28773-0.28773z"/><path d="m14.944 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.0041-0.15428 0.13346-0.29188 0.28773-0.28773z"/></g></svg>',
      play: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor"olor"olor" stroke-width=".3"><g transform="translate(0 -270.54)"><path d="m5.2917 292.21c1.638e-4 -5.7717-3.275e-4 -11.543 2.455e-4 -17.315 0.26319-1.0382 1.4726-1.5611 2.4514-1.1989 0.80816 0.23695 1.4691 0.80297 2.2081 1.194 4.3854 2.6267 8.7811 5.2375 13.16 7.8742 0.79505 0.54047 0.45033 1.7439-0.34988 2.0757-4.8532 2.9006-9.7064 5.8011-14.56 8.7017-1.0328 0.36658-2.332 0.0381-2.8269-1.0022-0.045938-0.10342-0.084738-0.21463-0.083483-0.32941z"/></g></g></svg>',
      shuffle0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width=".3"><path d="m5.6162 5.4125h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.076434-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14577-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.8261h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6193 14.195h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.07643-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.07376 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.845 18.582h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.07376 0.10708-0.12497 0.18688-0.12369z"/></g></svg>',
      shuffle2: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width=".3"><path d="m10.813 18.548c-0.35617 0.11095-0.14564 0.58998-0.20257 0.87583 0.01028 0.48528-0.02076 0.97467 0.01586 1.4573 0.21919 0.2371 0.60875 0.07634 0.90486 0.12353h2.8258c-0.05537-0.30204-0.09712-0.61075-0.07338-0.93127v-1.5254h-3.4706z"/><path d="m15.193 15.235c-0.44809 0.08695-0.23653 0.63372-0.28577 0.95902v4.5089c0.08728 0.44757 0.63383 0.23594 0.95902 0.28525h4.836c0.44765-0.08685 0.2359-0.63348 0.28525-0.95851v-4.5089c-0.08652-0.44816-0.63337-0.23649-0.95851-0.28577h-4.836zm0.56741 0.59324c1.4869 0.0118 2.9784-0.0236 4.4623 0.0177 0.25792 0.21902 0.09046 0.62233 0.13842 0.92678-0.01179 1.1608 0.02362 2.3264-0.01778 3.4843-0.21938 0.25783-0.62259 0.09051-0.92722 0.13842-1.2474-0.01185-2.4996 0.0237-3.7441-0.01778-0.25714-0.21976-0.09015-0.6226-0.13798-0.92722 0.01173-1.1608-0.02351-2.3263 0.0177-3.4842 0.03349-0.08241 0.11959-0.13946 0.20864-0.13798z"/><path d="m5.6177 5.386h9.9891c0.35637 0.11098 0.14585 0.59007 0.20276 0.87601-0.0103 0.48529 0.0208 0.97471-0.01588 1.4574-0.21917 0.23733-0.60884 0.076486-0.90501 0.12369h-9.2709c-0.35638-0.11098-0.14586-0.59007-0.20276-0.87601 0.010298-0.48529-0.020796-0.97471 0.015885-1.4574 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.7732h9.9891c0.35637 0.11098 0.14585 0.59006 0.20276 0.87601-0.0103 0.4853 0.0208 0.97471-0.01589 1.4574-0.21917 0.23733-0.60884 0.07648-0.90501 0.12369h-9.2709c-0.35637-0.11098-0.14585-0.59006-0.20276-0.87601 0.0103-0.4853-0.0208-0.97471 0.01589-1.4574 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6177 14.16c-0.35682 0.11055-0.14617 0.5899-0.20309 0.87583 0.010332 0.48531-0.020862 0.97475 0.015936 1.4574 0.21915 0.23774 0.609 0.07674 0.90529 0.12397h7.9475c0.01599-0.59386-0.03233-1.1941 0.0247-1.7839 0.23585-0.33075 0.70254-0.14135 1.053-0.19167 0.34447 0.08741 0.60141-0.07206 0.38911-0.42246-0.39444-0.12791-0.84703-0.02699-1.2655-0.05916h-8.867z"/></g></svg>',
      repeat0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path transform="scale(.26458)" d="m35.473 20.621c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h29.055c8.2281 0 14.852-6.6235 14.852-14.852v-29.055c0-8.2281-6.6235-14.852-14.852-14.852h-4.0195v9.6641c0 0.05754-0.01898 0.1113-0.02344 0.16797 5.108 0.40503 9.1016 4.6456 9.1016 9.8613v19.371c0 5.4854-4.415 9.9004-9.9004 9.9004h-19.371c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4854 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04363-0.01758-0.08477-0.01758-0.12891v-9.6641z" fill="currentColor" stroke-linecap="round"/><path d="m10.111 9.4128v-5.3598c-0.0082 0.018122-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.098349 0.16971 0.29612c-4.97e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.063572c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /></g></svg>',
      repeat1: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path transform="scale(.26458)" d="m35.471 20.607c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h15.297c-0.099283-0.23342-0.20508-0.4639-0.28516-0.70898-1.0314-3.157-0.36829-6.37 1.3789-9.084h-11.549c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4853 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04362-0.01758-0.08476-0.01758-0.12891v-9.6641zm25.035 0v9.6641c0 0.05752-0.0189 0.11131-0.02344 0.16797 1.6304 0.12928 3.1454 0.65289 4.4551 1.4707v-4.7422h10.172l-0.17773 3.0039v0.0078c0.0017 0.81652 0.51993 2.0016 1.6992 3.5879 0.75387 1.014 1.7283 2.1484 2.7461 3.3945v-1.7031c0-8.2281-6.6235-14.852-14.852-14.852zm14.426 28.418-0.0078 23.127c0.02228 1.1774-0.15778 2.3265-0.49805 3.4277 3.0352-2.7155 4.9512-6.6543 4.9512-11.066v-4.1504c-0.56305 0.11278-1.2016 0.10116-1.877-0.18359-1.5706-0.66221-1.9257-2.0105-2.0215-2.7676-0.09574-0.75705 3e-3 -1.3469 0.18359-1.9414 0.08357-0.27565 0.31768-3.3953-0.38281-5.7285-0.08795-0.29287-0.24795-0.45038-0.34766-0.7168z" fill="currentColor" stroke="currentColor" stroke-linecap="round"/><path d="m10.111 9.4094v-5.3598c-0.0082 0.01812-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.09835 0.16971 0.29612c-5.03e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.06357c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /><path d="m19.028 7.9826h-1.0564v9.5915c-0.58411-0.2504-1.34-0.25388-2.0856 0.04816-1.3358 0.54165-2.1316 1.8592-1.7778 2.9424 0.35402 1.0835 1.7238 1.5224 3.0594 0.98077 1.1345-0.45993 1.8767-1.4796 1.8585-2.4399l0.0018-7.8441c1.842 0.32346 1.9681 2.9181 1.7475 3.6457-0.08378 0.27574 0.06375 0.48221 0.34217 0 1.9862-3.4426-2.0896-4.9615-2.0896-6.9244z" /></g></svg>',
      rew: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-miterlimit="4.1" stroke-width=".3"><path d="m21.082 18.805c-9.3e-5 -3.7545 1.87e-4 -7.509-1.4e-4 -11.263-0.13349-0.79848-1.117-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09983 1.6587-0.86625z"/><path d="m15.791 18.805c-8.7e-5 -3.7545 1.73e-4 -7.509-1.3e-4 -11.263-0.13345-0.79849-1.1171-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09982 1.6587-0.86625z"/><path d="m7.5828 5.3572c-0.68239 0.014305-1.3705-0.02913-2.0492 0.022654-0.31228 0.23669-0.12538 0.69262-0.1764 1.0359v14.396c0.087332 0.45287 0.63952 0.23962 0.96802 0.28916 0.45618-0.01348 0.91782 0.028 1.3703-0.02265 0.31228-0.23669 0.12538-0.69262 0.1764-1.0359v-14.396c0.00417-0.15504-0.13412-0.29333-0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
      add: '<svg viewBox="0 0 24 24"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path d="M14 10H3v2h11zm0-4H3v2h11zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2zM3 16h7v-2H3z"></path></g></svg>',
      menuback: '<svg viewBox="0 0 24 24"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></g></svg>',
      next: '<svg viewBox="0 0 24 24"><g fill="currentColor" stroke="currentColor" stroke-width=".3"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></g></svg>'
    },
    playerattributes: [
      "Playername",
      "PlayerID",
      "Connected",
      "IP",
      "Power",
      "Mode",
      "Time",
      "Rate",
      "SyncSlaves",
      "SyncMaster",
      "Volume",
      "PlaylistRepeat",
      "PlaylistShuffle",
      "Remote",
      "Playlist",
      "PlaylistCurrentIndex",
      "state",
      "Duration",
      "Bitrate",
      "Album",
      "ArtworkUrl",
      "Genre",
      "Type",
      "Title",
      "Artist",
      "Albumartist",
      "Trackartist",
      "Band",
      "Url",
      "RadioName"
    ],
    playerConfigurationEditor: function(widAttr) {
      return configurationEditor("players", widAttr);
    },
    favoriteConfigurationEditor: function(widAttr) {
      return configurationEditor("favorites", widAttr);
    },
    instanceSelect: function(widAttr) {
      const inputID = `inspect_${widAttr}`;
      const optionHtml = (instances) => [""].concat(instances).map((instance) => `<option value="${instance}">${instance}</option>`).join("");
      const knownInstances = collectSqueezeboxInstances(vis.objects || {});
      setTimeout(() => {
        if (typeof vis.conn.getObjectView != "function") {
          return;
        }
        vis.conn.getObjectView(
          "system",
          "instance",
          {
            startkey: "system.adapter.squeezeboxrpc.",
            endkey: "system.adapter.squeezeboxrpc.\u9999"
          },
          (error, result) => {
            if (error) {
              console.error("Cannot read SqueezeboxRPC instances:", error);
              return;
            }
            const $select = $(`#${inputID}`);
            if (!$select.length) {
              return;
            }
            const selected = $select.val();
            const instances = collectSqueezeboxInstances(result);
            if (selected && !instances.includes(selected)) {
              instances.unshift(selected);
            }
            $select.html(optionHtml(instances)).val(selected);
          }
        );
      }, 0);
      return { input: `<select type="text" id="${inputID}">${optionHtml(knownInstances)}</select>` };
    },
    getPlayerWidgetData: function(playerWidgetID) {
      var _a, _b, _c, _d;
      if ((_b = (_a = vis.widgets) == null ? void 0 : _a[playerWidgetID]) == null ? void 0 : _b.data) {
        return vis.widgets[playerWidgetID].data;
      }
      for (const view of Object.values(vis.views || {})) {
        if ((_d = (_c = view.widgets) == null ? void 0 : _c[playerWidgetID]) == null ? void 0 : _d.data) {
          return view.widgets[playerWidgetID].data;
        }
      }
      return null;
    },
    getPlayerWidgetType: function(_view, playerWidgetID) {
      var _a;
      return ((_a = this.getPlayerWidgetData(playerWidgetID)) == null ? void 0 : _a.formattype) || "";
    },
    checkAttributes: function($div, widgetPlayer) {
      if (!widgetPlayer) {
        $div.html("Please select a player widget");
        return false;
      }
      const playerData = this.getPlayerWidgetData(widgetPlayer);
      if (!(playerData == null ? void 0 : playerData.ainstance)) {
        $div.html("Please select an instance at the playerwidget");
        return false;
      }
      const ainstance = playerData.ainstance.split(".");
      if (!ainstance || ainstance[0] != "squeezeboxrpc") {
        $div.html("Please select an instance at the playerwidget");
        return false;
      }
      return ainstance;
    },
    setChanged: function(widgetPlayer, fdata) {
      $("body").off(`squeezeboxrpcplayerchange.${fdata.widgetID}`).on(`squeezeboxrpcplayerchange.${fdata.widgetID}`, fdata, function(_event, changedWidget) {
        if (changedWidget != widgetPlayer) {
          return;
        }
        const self = fdata.self;
        self.setState(fdata);
      });
    },
    setPlayersChanged: function($div, widgetPlayer, fdata, onChange_callback, boundstates_callback, playerChanged_callback) {
      const bindPlayerStates = () => {
        const boundstates = boundstates_callback(fdata);
        if (boundstates == null ? void 0 : boundstates.length) {
          vis.binds["squeezeboxrpc"].bindStates($div, boundstates, onChange_callback, fdata);
        }
      };
      $("body").off(`squeezeboxrpcplayerschanged.${fdata.widgetID}`).on(`squeezeboxrpcplayerschanged.${fdata.widgetID}`, (_event, changedWidget) => {
        if (changedWidget != widgetPlayer) {
          return;
        }
        bindPlayerStates();
        playerChanged_callback == null ? void 0 : playerChanged_callback(fdata);
      });
      bindPlayerStates();
    },
    bindStates: function(elem, bound, change_callback, fdata) {
      const $div = $(elem);
      const boundstates = $div.data("bound");
      if (boundstates) {
        for (let i = 0; i < boundstates.length; i++) {
          vis.states.unbind(boundstates[i], change_callback);
        }
      }
      $div.data("bound", null);
      $div.data("bindHandler", null);
      vis.conn.gettingStates = 0;
      vis.conn.getStates(
        bound,
        function(error, states) {
          if (error) {
            console.error("Cannot read initial widget states:", error);
          }
          vis.updateStates(states || {});
          vis.conn.subscribe(bound);
          for (let i = 0; i < bound.length; i++) {
            bound[i] = `${bound[i]}.val`;
            vis.states.bind(bound[i], change_callback);
          }
          $div.data("bound", bound);
          $div.data("bindHandler", change_callback);
          change_callback.call(fdata);
        }.bind({ fdata, change_callback })
      );
    },
    attrSelect: function(wid_attr, options) {
      if (wid_attr === "widgetPlayer") {
        options = this.findPlayerWidgets();
      }
      if (wid_attr === "widgetFavorites") {
        options = this.findFavoritesWidgets();
      }
      let html = "";
      for (let i = 0; i < options.length; i++) {
        const value = typeof options[i] == "string" ? options[i] : options[i].value;
        const label = typeof options[i] == "string" ? options[i] : options[i].label;
        html += `<option value="${value}">${label}</option>`;
      }
      const line = {
        input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`
      };
      return line;
    },
    playerAttrSelect: function(wid_attr) {
      let html = "";
      const playerattributes = vis.binds["squeezeboxrpc"].playerattributes.sort();
      for (let i = 0; i < playerattributes.length; i++) {
        html += `<option value="${playerattributes[i]}">${playerattributes[i]}</option>`;
      }
      const line = {
        input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`
      };
      return line;
    },
    findPlayerWidgets: function() {
      var _a, _b;
      const result = [];
      for (const [viewName, view] of Object.entries(vis.views || {})) {
        for (const [widgetID, widget] of Object.entries(view.widgets || {})) {
          if (widget.tpl == "tplSqueezeboxrpcPlayer") {
            const instance = String(((_a = widget.data) == null ? void 0 : _a.ainstance) || "").replace(/^system\.adapter\./, "");
            const name = String(((_b = widget.data) == null ? void 0 : _b.name) || widgetID);
            result.push({
              value: widgetID,
              label: instance ? `${instance} (${viewName}: ${name})` : `${viewName}: ${name}`
            });
          }
        }
      }
      return result.sort((left, right) => left.label.localeCompare(right.label, void 0, { numeric: true }));
    },
    findFavoritesWidgets: function() {
      const widgets = vis.views[vis.activeView].widgets;
      const keys = Object.keys(widgets);
      const result = [];
      for (let i = 0; i < keys.length; i++) {
        if (widgets[keys[i]].tpl == "tplSqueezeboxrpcFavorites") {
          result.push(keys[i]);
        }
      }
      return result;
    },
    getPlayerValues: function(widgetPlayer) {
      var _a, _b;
      const domValues = $(`input[name=${widgetPlayer}], #${widgetPlayer} option`).toArray().reduce(function(acc, cur) {
        if ($(cur).val()) {
          acc.push($(cur).val());
        }
        return acc;
      }, []);
      if (domValues.length) {
        return domValues;
      }
      const published = (_a = this.playerSelections[widgetPlayer]) == null ? void 0 : _a.players;
      if (published == null ? void 0 : published.length) {
        return published.slice();
      }
      const configuration = parseItemConfiguration((_b = this.getPlayerWidgetData(widgetPlayer)) == null ? void 0 : _b.playerConfiguration);
      return configuration ? configuration.items.filter((item) => item.enabled !== false).map((item) => item.id) : [];
    },
    getPlayerName: function(widgetPlayer) {
      var _a, _b, _c;
      const domValue = $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
      if (domValue) {
        return domValue;
      }
      const published = (_a = this.playerSelections[widgetPlayer]) == null ? void 0 : _a.player;
      if (published) {
        return published;
      }
      const configuration = parseItemConfiguration((_b = this.getPlayerWidgetData(widgetPlayer)) == null ? void 0 : _b.playerConfiguration);
      const players2 = (configuration == null ? void 0 : configuration.items.filter((item) => item.enabled !== false)) || [];
      return players2.some((item) => item.id == (configuration == null ? void 0 : configuration.defaultId)) ? configuration.defaultId : (_c = players2[0]) == null ? void 0 : _c.id;
    },
    publishPlayerSelection: function(widgetPlayer) {
      const playerData = this.getPlayerWidgetData(widgetPlayer);
      const player = $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
      const players2 = $(`input[name=${widgetPlayer}], #${widgetPlayer} option`).toArray().map((element) => $(element).val()).filter(Boolean);
      if (!(playerData == null ? void 0 : playerData.ainstance) || !player) {
        return;
      }
      this.playerSelections[widgetPlayer] = {
        instance: String(playerData.ainstance).replace(/^system\.adapter\./, ""),
        player,
        players: players2
      };
      $("body").trigger("squeezeboxrpcplayerchange", [widgetPlayer]);
    },
    getPlayerNameAsync: function(widgetPlayer) {
      return __async(this, null, function* () {
        return new Promise((resolve, reject) => {
          (() => __async(this, null, function* () {
            let i = 0;
            while (i < 1e3) {
              let playername = this.getPlayerName(widgetPlayer);
              if (!playername) {
                yield new Promise((r) => setTimeout(r, 100));
              } else {
                resolve(playername);
                return;
              }
              i++;
              console.log(i);
            }
            reject();
          }))();
        });
      });
    },
    onHorizChange: function(widgetID, view, newId) {
      const data = vis.views[view].widgets[widgetID].data;
      if (newId == "vertical") {
        data.segheight = "100%";
        data.segwidth = "100%";
      } else {
        data.segheight = "20px";
        data.segwidth = "20px";
      }
      return true;
    },
    editDimension: function(widgetID, view, newId, attr) {
      if (newId && typeof newId !== "object") {
        const e = newId.substring(newId.length - 2);
        if (e !== "px" && e !== "em" && newId[newId.length - 1] !== "%") {
          vis.views[view].widgets[widgetID].data[attr] = `${newId}px`;
        }
      }
    },
    browsesendToAsync: function(instance, command, sendData) {
      return __async(this, null, function* () {
        let result = yield vis.binds["squeezeboxrpc"].sendToAsync(instance, command, sendData);
        if (vis.binds["squeezeboxrpc"].fetchResults) {
          console.debug("debugbrowsersendtoasync", {
            debug: "debug data",
            instance,
            command,
            sendData,
            result
          });
        }
        return result;
      });
    },
    sendToAsync: function(instance, command, sendData) {
      return __async(this, null, function* () {
        console.log(`sendToAsync ${command} ${JSON.stringify(sendData)}`);
        return new Promise((resolve) => {
          try {
            vis.conn.sendTo(instance, command, sendData, function(receiveData) {
              resolve(receiveData);
            });
          } catch (error) {
            throw error;
          }
        });
      });
    },
    getPlaylistData: function(instance) {
      return __async(this, null, function* () {
        console.log(`getPlaylistData`);
        const data = {
          playerid: "",
          cmdArray: ["playlists", "0", "999", "tags:us"]
        };
        return yield this.sendToAsync(instance, "cmdGeneral", data);
      });
    },
    getPlayerID: function(state) {
      return __async(this, null, function* () {
        console.log(`getPlayerID`);
        return new Promise((resolve, reject) => {
          try {
            vis.conn.gettingStates = 0;
            vis.conn.getStates([state], function(error, states) {
              resolve(states[state].val);
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    browser,
    favorites,
    players,
    buttonplay,
    buttonfwd,
    buttonrew,
    buttonrepeat,
    buttonshuffle,
    volumebar,
    syncgroup,
    playtime,
    string,
    playlist,
    playlistdetail,
    number,
    datetime,
    image
  };
  vis.binds["squeezeboxrpc"].showVersion();

  // squeezeboxrpc/js/bundle.js
  var import_date_format = __toESM(require_date_format());
})();
//# sourceMappingURL=squeezeboxrpc-dist.js.map
