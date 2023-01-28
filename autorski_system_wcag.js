
/**
 *  WCAG 
 */
var LOCAL_STORAGE_OPTIONS_KEY = 'accessibility-config';
var UNITS = ['px', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'vh', 'vw', 'vmin'];


/**
 * Given a font size, return the unit (em, px, rem, etc.)
 * @param fontSize - The font size to be converted.
 * @returns The unit that matches the fontSize.
 */
function getUnit(fontSize) {
      fontSize = fontSize || '';
      return UNITS
            .filter(unit => fontSize.match(new RegExp(unit + '$', 'gi')))
            .pop()
}

/**
 * Returns true if the current browser is Google Chrome
 * @returns a boolean value.
 */
function isGoogleChrome() {
      var isChromium = window.chrome;
      var winNav = window.navigator;
      var vendorName = winNav.vendor;
      var isOpera = winNav.userAgent.indexOf("OPR") > -1;
      var isIEedge = winNav.userAgent.indexOf("Edge") > -1;

      return (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false);
}

/**
 * This function checks if the user is using a mobile browser
 * @returns a boolean value.
 */
function isMobileBrowser() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      var product = userAgent.substr(0, 4);
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(product);
}

/**
 * Get the user options from local storage
 * @returns The getUserOptions function returns an object.
 */
function getUserOptions() {
      var data;

      try {
            data = localStorage.getItem(LOCAL_STORAGE_OPTIONS_KEY);
            data = JSON.parse(data);
      }
      catch (e) {
      }

      if (data && typeof data === "object") {
            return data;
      }
      else {
            return {};
      }
}

/**
 * It sets the user options in local storage.
 * @param options - The options object to be saved.
 */
function setUserOptions(options) {
      localStorage.setItem(LOCAL_STORAGE_OPTIONS_KEY, JSON.stringify(options));
}

/**
 * For each element in the selector, apply the zoom factor to the font size
 * @param selector - The CSS selector to apply the zoom to.
 * @param zoom - The zoom factor to apply to the text.
 */
function applyTextZoom(selector, zoom) {
      $(selector)
            .not('.accessibility *')
            .each(function () {
                  var element = $(this);

                  var originalFontSize = element.attr('data-accessibility-text-original');
                  if (!originalFontSize) {
                        originalFontSize = element.css('font-size');
                        element.attr('data-accessibility-text-original', originalFontSize);
                  }

                  var units = getUnit(originalFontSize) || '';
                  var fontSize = parseFloat(originalFontSize) * zoom;

                  element.css('font-size', fontSize + units);
            });
}

/**
 * * For each element in the container, set the max-width to the original font size times the zoom
 * factor
 * @param selector - The selector for the element you want to resize.
 * @param zoom - The zoom factor to apply to the container.
 */
function applyContainerResize(selector, zoom) {
      $(selector)
            .not('.accessibility *')
            .each(function () {
                  var element = $(this);

                  var oryginalContainerSize = element.attr('data-accessibility-container-original');
                  if (!oryginalContainerSize) {
                        oryginalContainerSize = element.css('max-width');
                        element.attr('data-accessibility-container-original', oryginalContainerSize);
                  }

                  var units = getUnit(oryginalContainerSize) || '';
                  var containerWidth = parseFloat(oryginalContainerSize) * zoom;

                  element.css('max-width', containerWidth + units);
            });
}

$.fn.openAccessibility = function (customOptions) {
      customOptions = customOptions || {};

      var defaultOptions = {
            highlightedLinks: true,
            isMobileEnabled: true,
            grayscale: 0,
            contrast: 100,
            brightness: 100,
            maxZoomLevel: 3,
            minZoomLevel: 0.5,
            zoomStep: 0.2,
            zoom: 1,
            zoomContainer: 1,
            cursor: false,
            textSelector: '.accessibility-text',
            containerSelector: '.container',
            highContrast: false,
            highContrastBg: false
      };

      var userOptions = getUserOptions();
      var initialOptions = $.extend({}, defaultOptions, customOptions);
      var options = $.extend({}, initialOptions, userOptions, customOptions);


      /* The above code is disabling the accessibility plugin if the user is on a mobile browser. */
      if (!options.isMobileEnabled && isMobileBrowser()) {
            console.log('disabling accessibility plugin due to mobile browser');
            return;
      }

      // -------------
      /* The above code is adding JavaScript functionality to the buttons on the page. */
      var html = $('html');
      var cursorButton = $(".accessibility-cursor-button");
      var zoomInButton = $(".accessibility-zoom-in-button");
      var zoomOutButton = $(".accessibility-zoom-out-button");
      var containerZoomInButton = $(".accessibility-container-zoom-in-button");
      var containerZoomOutButton = $(".accessibility-container-zoom-out-button");
      var monochromeButton = $(".accessibility-monochrome-button");
      var contrastButton = $(".accessibility-contrast-button");
      var highContrastButton = $(".accessibility-highcontrast-button");
      var highContrastBgButton = $(".accessibility-highcontrast-bg-button");
      var resetButton = $(".accessibility-reset-button");
      var cursorWorkaround = $(".accessibility-cursor-workaround");
      var standardButton = $(".accessibility-standard-button");

      // -------------
      // Back to stock
      standardButton.click(() => {
            options.grayscale = 0;
            options.contrast = 100;
            options.brightness = 100;
            options.highContrast = false;
            options.highContrastBg = false;
            apply();
      });

      // -------------
      // Brightness
      /* Adding 50 to the contrast value and then applying the filter. */
      contrastButton.click(() => {
            options.contrast += 50;
            if (options.contrast > 150) {
                  options.contrast = 50;
            }

            apply();
      });


      // -------------
      // Grayscale
      /* The above code is adding a click event to the monochrome button. The click event is calling a
      function that adds 100 to the grayscale value. If the grayscale value is greater than 100, it is
      set to 0. The apply function is then called. */
      monochromeButton.click(() => {
            options.grayscale += 100;
            if (options.grayscale > 100) {
                  options.grayscale = 0;
            }
            apply();
      });

      // -------------
      // Reset
      /* Adding a click event to the resetButton. */
      resetButton.click(() => {
            options = $.extend({}, initialOptions);

            apply();
      });

      // -------------
      // Zoom
      /* The above code is creating a zoom in and zoom out button. When the zoom in button is clicked, the
      zoom level is increased by the zoom step. When the zoom out button is clicked, the zoom level is
      decreased by the zoom step. */
      zoomInButton.click(() => {
            options.zoom = Math.min(options.maxZoomLevel, options.zoom + options.zoomStep);
            apply();
      });

      zoomOutButton.click(() => {
            options.zoom = Math.max(options.minZoomLevel, options.zoom - options.zoomStep);
            apply();
      });

      containerZoomInButton.click(() => {
            options.zoomContainer = Math.min(options.maxZoomLevel, options.zoomContainer + options.zoomStep);
            apply();
      });

      containerZoomOutButton.click(() => {
            options.zoomContainer = 1;
            apply();
      });

      // -------------
      // Cursor
      cursorButton.click(() => {
            options.cursor = !options.cursor;
            apply();
      });

      // -------------
      // High Contrast
      highContrastButton.click(() => {
            options.highContrast = !options.highContrast;
            apply();
      });

      // -------------
      // High Contrast Bg
      highContrastBgButton.click(() => {
            options.highContrastBg = !options.highContrastBg;
            apply();
      });

      // -------------
      // Mouse cursor workaround
      cursorWorkaround.hide();

      var googleChrome = isGoogleChrome();
      if (!googleChrome) {

            $(document).on('mousemove', function (e) {

                  if (!options.cursor) {
                        return;
                  }

                  cursorWorkaround.css({
                        left: e.pageX / options.zoom,
                        top: e.pageY / options.zoom
                  });
            });
      }

      // Initialize
      applyTextZoom(options.textSelector, 1);
      applyContainerResize(options.containerSelector, 1);

      /* Applying the function apply() to the variable apply. */
      apply();

      /**
       * Apply the user's settings to the page
       */
      function apply() {
            // ----------------
            // Filters

            var filters = [];

            filters.push('brightness(' + options.brightness + '%)');
            filters.push('grayscale(' + options.grayscale + '%)');
            filters.push('contrast(' + options.contrast + '%)');
            var filterValue = filters.join(' ');
            html.css('filter', filterValue);
            html.css('-ms-filter', filterValue);
            html.css('-moz-filter', filterValue);
            html.css('-webkit-filter', filterValue);
            html.css('-o-filter', filterValue);

            // ----------
            // Zoom
            applyTextZoom(options.textSelector, options.zoom);

            // ----------
            // Container resizer
            applyContainerResize(options.containerSelector, options.zoomContainer);

            // ----------
            // Cursor
            if (options.cursor) {
                  html.addClass('accessibility-cursor');

                  if (!googleChrome) {
                        cursorWorkaround.show();
                  }
            }
            else {
                  html.removeClass('accessibility-cursor');

                  if (!googleChrome) {
                        cursorWorkaround.hide();
                  }
            }

            // ----------
            // High Contrast
            if (options.highContrast) {
                  html.removeClass('accessibility-high-contrast-bg');
                  html.addClass('accessibility-high-contrast');
            }
            else {
                  html.removeClass('accessibility-high-contrast');
            }

            // ----------
            // High Contrast Bg
            if (options.highContrastBg) {
                  html.removeClass('accessibility-high-contrast');
                  html.addClass('accessibility-high-contrast-bg');
            }
            else {
                  html.removeClass('accessibility-high-contrast-bg');
            }

            setUserOptions(options);
      }

};

class NavigationContentGenerator {
      constructor(siteURL, siteName) {
            this.siteName = siteName;
            this.siteURL = siteURL;
            this.fillerTextSentences = [];

            this.fillerTextSentences.push(
                  'The content on this page is associated with the <a href="$linkURL">$linkName</a> link for <a href="$siteURL">$siteName</a>.'
            );
      }

      renderParagraph(linkURL, linkName) {
            var content = '';
            this.fillerTextSentences.forEach(
                  (s) =>
                  (content += s
                        .replace('$siteName', this.siteName)
                        .replace('$siteURL', this.siteURL)
                        .replace('$linkName', linkName)
                        .replace('$linkURL', linkURL))
            );
            return content;
      }
}

class MenubarNavigation {
      constructor(domNode) {
            var linkURL, linkTitle;

            this.domNode = domNode;

            this.menuitems = [];
            this.popups = [];
            this.menuitemGroups = {};
            this.menuOrientation = {};
            this.isPopup = {};
            this.isPopout = {};
            this.openPopups = false;

            this.firstChars = {}; // see Menubar init method
            this.firstMenuitem = {}; // see Menubar init method
            this.lastMenuitem = {}; // see Menubar init method

            this.initMenu(domNode, 0);

            domNode.addEventListener('focusin', this.handleMenubarFocusin.bind(this));
            domNode.addEventListener('focusout', this.handleMenubarFocusout.bind(this));

            window.addEventListener(
                  'mousedown',
                  this.handleBackgroundMousedown.bind(this),
                  true
            );

            domNode.querySelector('[role=menuitem]').tabIndex = 0;
      }

      getParentMenuitem(menuitem) {
            var node = menuitem.parentNode;
            if (node) {
                  node = node.parentNode;
                  if (node) {
                        node = node.previousElementSibling;
                        if (node) {
                              if (node.getAttribute('role') === 'menuitem') {
                                    return node;
                              }
                        }
                  }
            }
            return false;
      }

      getMenuitems(domNode, depth) {
            var nodes = [];

            var initMenu = this.initMenu.bind(this);
            var popups = this.popups;

            function findMenuitems(node) {
                  var role, flag;

                  while (node) {
                        flag = true;
                        role = node.getAttribute('role');

                        if (role) {
                              role = role.trim().toLowerCase();
                        }

                        switch (role) {
                              case 'menu':
                                    node.tabIndex = -1;
                                    initMenu(node, depth + 1);
                                    flag = false;
                                    break;

                              case 'menuitem':
                                    if (node.getAttribute('aria-haspopup') === 'true') {
                                          popups.push(node);
                                    }
                                    nodes.push(node);
                                    break;

                              default:
                                    break;
                        }

                        if (
                              flag &&
                              node.firstElementChild &&
                              node.firstElementChild.tagName !== 'svg'
                        ) {
                              findMenuitems(node.firstElementChild);
                        }
                        node = node.nextElementSibling;
                  }
            }
            findMenuitems(domNode.firstElementChild);
            return nodes;
      }

      initMenu(menu, depth) {
            var menuitems, menuitem, role;

            var menuId = this.getMenuId(menu);

            menuitems = this.getMenuitems(menu, depth);
            this.menuOrientation[menuId] = this.getMenuOrientation(menu);

            this.isPopup[menuId] = menu.getAttribute('role') === 'menu' && depth === 1;
            this.isPopout[menuId] = menu.getAttribute('role') === 'menu' && depth > 1;

            this.menuitemGroups[menuId] = [];
            this.firstChars[menuId] = [];
            this.firstMenuitem[menuId] = null;
            this.lastMenuitem[menuId] = null;

            for (var i = 0; i < menuitems.length; i++) {
                  menuitem = menuitems[i];
                  role = menuitem.getAttribute('role');

                  if (role.indexOf('menuitem') < 0) {
                        continue;
                  }

                  menuitem.tabIndex = -1;
                  this.menuitems.push(menuitem);
                  this.menuitemGroups[menuId].push(menuitem);
                  this.firstChars[menuId].push(
                        menuitem.textContent.trim().toLowerCase()[0]
                  );

                  menuitem.addEventListener('keydown', this.handleKeydown.bind(this));
                  menuitem.addEventListener('click', this.handleMenuitemClick.bind(this), {
                        capture: true,
                  });

                  menuitem.addEventListener(
                        'mouseover',
                        this.handleMenuitemMouseover.bind(this)
                  );

                  if (!this.firstMenuitem[menuId]) {
                        if (this.hasPopup(menuitem)) {
                              menuitem.tabIndex = 0;
                        }
                        this.firstMenuitem[menuId] = menuitem;
                  }
                  this.lastMenuitem[menuId] = menuitem;
            }
      }

      setFocusToMenuitem(menuId, newMenuitem) {
            this.closePopupAll(newMenuitem);

            if (this.menuitemGroups[menuId]) {
                  this.menuitemGroups[menuId].forEach(function (item) {
                        if (item === newMenuitem) {
                              item.tabIndex = 0;
                              newMenuitem.focus();
                        } else {
                              item.tabIndex = -1;
                        }
                  });
            }
      }

      setFocusToFirstMenuitem(menuId) {
            this.setFocusToMenuitem(menuId, this.firstMenuitem[menuId]);
      }

      setFocusToLastMenuitem(menuId) {
            this.setFocusToMenuitem(menuId, this.lastMenuitem[menuId]);
      }

      setFocusToPreviousMenuitem(menuId, currentMenuitem) {
            var newMenuitem, index;

            if (currentMenuitem === this.firstMenuitem[menuId]) {
                  newMenuitem = this.lastMenuitem[menuId];
            } else {
                  index = this.menuitemGroups[menuId].indexOf(currentMenuitem);
                  newMenuitem = this.menuitemGroups[menuId][index - 1];
            }

            this.setFocusToMenuitem(menuId, newMenuitem);

            return newMenuitem;
      }

      setFocusToNextMenuitem(menuId, currentMenuitem) {
            var newMenuitem, index;

            if (currentMenuitem === this.lastMenuitem[menuId]) {
                  newMenuitem = this.firstMenuitem[menuId];
            } else {
                  index = this.menuitemGroups[menuId].indexOf(currentMenuitem);
                  newMenuitem = this.menuitemGroups[menuId][index + 1];
            }
            this.setFocusToMenuitem(menuId, newMenuitem);

            return newMenuitem;
      }

      setFocusByFirstCharacter(menuId, currentMenuitem, char) {
            var start, index;

            char = char.toLowerCase();

            // Get start index for search based on position of currentItem
            start = this.menuitemGroups[menuId].indexOf(currentMenuitem) + 1;
            if (start >= this.menuitemGroups[menuId].length) {
                  start = 0;
            }

            // Check remaining slots in the menu
            index = this.getIndexFirstChars(menuId, start, char);

            // If not found in remaining slots, check from beginning
            if (index === -1) {
                  index = this.getIndexFirstChars(menuId, 0, char);
            }

            // If match was found...
            if (index > -1) {
                  this.setFocusToMenuitem(menuId, this.menuitemGroups[menuId][index]);
            }
      }

      // Utilities

      getIndexFirstChars(menuId, startIndex, char) {
            for (var i = startIndex; i < this.firstChars[menuId].length; i++) {
                  if (char === this.firstChars[menuId][i]) {
                        return i;
                  }
            }
            return -1;
      }

      isPrintableCharacter(str) {
            return str.length === 1 && str.match(/\S/);
      }

      getIdFromAriaLabel(node) {
            var id = node.getAttribute('aria-label');
            if (id) {
                  id = id.trim().toLowerCase().replace(' ', '-').replace('/', '-');
            }
            return id;
      }

      getMenuOrientation(node) {
            var orientation = node.getAttribute('aria-orientation');

            if (!orientation) {
                  var role = node.getAttribute('role');

                  switch (role) {
                        case 'menubar':
                              orientation = 'horizontal';
                              break;

                        case 'menu':
                              orientation = 'vertical';
                              break;

                        default:
                              break;
                  }
            }

            return orientation;
      }

      getMenuId(node) {
            var id = false;
            var role = node.getAttribute('role');

            while (node && role !== 'menu' && role !== 'menubar') {
                  node = node.parentNode;
                  if (node) {
                        role = node.getAttribute('role');
                  }
            }

            if (node) {
                  id = role + '-' + this.getIdFromAriaLabel(node);
            }

            return id;
      }

      getMenu(menuitem) {
            var menu = menuitem;
            var role = menuitem.getAttribute('role');

            while (menu && role !== 'menu' && role !== 'menubar') {
                  menu = menu.parentNode;
                  if (menu) {
                        role = menu.getAttribute('role');
                  }
            }

            return menu;
      }

      // Popup menu methods

      isAnyPopupOpen() {
            for (var i = 0; i < this.popups.length; i++) {
                  if (this.popups[i].getAttribute('aria-expanded') === 'true') {
                        return true;
                  }
            }
            return false;
      }

      setMenubarDataExpanded(value) {
            this.domNode.setAttribute('data-menubar-item-expanded', value);
      }

      isMenubarDataExpandedTrue() {
            return this.domNode.getAttribute('data-menubar-item-expanded') === 'true';
      }

      openPopup(menuId, menuitem) {
            // set aria-expanded attribute
            var popupMenu = menuitem.nextElementSibling;

            if (popupMenu) {
                  var rect = menuitem.getBoundingClientRect();

                  // Set CSS properties
                  if (this.isPopup[menuId]) {
                        popupMenu.parentNode.style.position = 'relative';
                        popupMenu.style.display = 'block';
                        popupMenu.style.position = 'absolute';
                        popupMenu.style.left = rect.width + 10 + 'px';
                        popupMenu.style.top = '0px';
                        popupMenu.style.zIndex = 100;
                  } else {
                        popupMenu.style.display = 'block';
                        popupMenu.style.position = 'absolute';
                        popupMenu.style.left = '0px';
                        popupMenu.style.top = rect.height + 8 + 'px';
                        popupMenu.style.zIndex = 100;
                  }

                  menuitem.setAttribute('aria-expanded', 'true');
                  this.setMenubarDataExpanded('true');
                  return this.getMenuId(popupMenu);
            }

            return false;
      }

      closePopout(menuitem) {
            var menu,
                  menuId = this.getMenuId(menuitem),
                  cmi = menuitem;

            while (this.isPopup[menuId] || this.isPopout[menuId]) {
                  menu = this.getMenu(cmi);
                  cmi = menu.previousElementSibling;
                  menuId = this.getMenuId(cmi);
                  menu.style.display = 'none';
            }
            cmi.focus();
            return cmi;
      }

      closePopup(menuitem) {
            var menu,
                  menuId = this.getMenuId(menuitem),
                  cmi = menuitem;

            if (this.isMenubar(menuId)) {
                  if (this.isOpen(menuitem)) {
                        menuitem.setAttribute('aria-expanded', 'false');
                        menuitem.nextElementSibling.style.display = 'none';
                  }
            } else {
                  menu = this.getMenu(menuitem);
                  cmi = menu.previousElementSibling;
                  cmi.setAttribute('aria-expanded', 'false');
                  cmi.focus();
                  menu.style.display = 'none';
            }

            return cmi;
      }

      doesNotContain(popup, menuitem) {
            if (menuitem) {
                  return !popup.nextElementSibling.contains(menuitem);
            }
            return true;
      }

      closePopupAll(menuitem) {
            if (typeof menuitem !== 'object') {
                  menuitem = false;
            }
            for (var i = 0; i < this.popups.length; i++) {
                  var popup = this.popups[i];
                  if (this.doesNotContain(popup, menuitem) && this.isOpen(popup)) {
                        var cmi = popup.nextElementSibling;
                        if (cmi) {
                              popup.setAttribute('aria-expanded', 'false');
                              cmi.style.display = 'none';
                        }
                  }
            }
      }

      hasPopup(menuitem) {
            return menuitem.getAttribute('aria-haspopup') === 'true';
      }

      isOpen(menuitem) {
            return menuitem.getAttribute('aria-expanded') === 'true';
      }

      isMenubar(menuId) {
            return !this.isPopup[menuId] && !this.isPopout[menuId];
      }

      isMenuHorizontal(menuitem) {
            return this.menuOrientation[menuitem] === 'horizontal';
      }

      hasFocus() {
            return this.domNode.classList.contains('focus');
      }

      // Menu event handlers

      handleMenubarFocusin() {
            // if the menubar or any of its menus has focus, add styling hook for hover
            this.domNode.classList.add('focus');
      }

      handleMenubarFocusout() {
            // remove styling hook for hover on menubar item
            this.domNode.classList.remove('focus');
      }

      handleKeydown(event) {
            var tgt = event.currentTarget,
                  key = event.key,
                  flag = false,
                  menuId = this.getMenuId(tgt),
                  id,
                  popupMenuId,
                  mi;

            switch (key) {
                  case ' ':
                  case 'Enter':
                        if (this.hasPopup(tgt)) {
                              this.openPopups = true;
                              popupMenuId = this.openPopup(menuId, tgt);
                              this.setFocusToFirstMenuitem(popupMenuId);
                        } else {
                              if (tgt.href !== '#') {
                                    this.closePopupAll();
                                    this.updateContent(tgt.href, tgt.textContent.trim());
                                    this.setMenubarDataExpanded('false');
                              }
                        }
                        flag = true;
                        break;

                  case 'Esc':
                  case 'Escape':
                        this.openPopups = false;
                        mi = this.closePopup(tgt);
                        id = this.getMenuId(mi);
                        this.setMenubarDataExpanded('false');
                        flag = true;
                        break;

                  case 'Up':
                  case 'ArrowUp':
                        if (this.isMenuHorizontal(menuId)) {
                              if (this.hasPopup(tgt)) {
                                    this.openPopups = true;
                                    popupMenuId = this.openPopup(menuId, tgt);
                                    this.setFocusToLastMenuitem(popupMenuId);
                              }
                        } else {
                              this.setFocusToPreviousMenuitem(menuId, tgt);
                        }
                        flag = true;
                        break;

                  case 'ArrowDown':
                  case 'Down':
                        if (this.isMenuHorizontal(menuId)) {
                              if (this.hasPopup(tgt)) {
                                    this.openPopups = true;
                                    popupMenuId = this.openPopup(menuId, tgt);
                                    this.setFocusToFirstMenuitem(popupMenuId);
                              }
                        } else {
                              this.setFocusToNextMenuitem(menuId, tgt);
                        }
                        flag = true;
                        break;

                  case 'Left':
                  case 'ArrowLeft':
                        if (this.isMenuHorizontal(menuId)) {
                              mi = this.setFocusToPreviousMenuitem(menuId, tgt);
                              if (this.isAnyPopupOpen() || this.isMenubarDataExpandedTrue()) {
                                    this.openPopup(menuId, mi);
                              }
                        } else {
                              if (this.isPopout[menuId]) {
                                    mi = this.closePopup(tgt);
                                    id = this.getMenuId(mi);
                                    mi = this.setFocusToMenuitem(id, mi);
                              } else {
                                    mi = this.closePopup(tgt);
                                    id = this.getMenuId(mi);
                                    mi = this.setFocusToPreviousMenuitem(id, mi);
                                    this.openPopup(id, mi);
                              }
                        }
                        flag = true;
                        break;

                  case 'Right':
                  case 'ArrowRight':
                        if (this.isMenuHorizontal(menuId)) {
                              mi = this.setFocusToNextMenuitem(menuId, tgt);
                              if (this.isAnyPopupOpen() || this.isMenubarDataExpandedTrue()) {
                                    this.openPopup(menuId, mi);
                              }
                        } else {
                              if (this.hasPopup(tgt)) {
                                    popupMenuId = this.openPopup(menuId, tgt);
                                    this.setFocusToFirstMenuitem(popupMenuId);
                              } else {
                                    mi = this.closePopout(tgt);
                                    id = this.getMenuId(mi);
                                    mi = this.setFocusToNextMenuitem(id, mi);
                                    this.openPopup(id, mi);
                              }
                        }
                        flag = true;
                        break;

                  case 'Home':
                  case 'PageUp':
                        this.setFocusToFirstMenuitem(menuId, tgt);
                        flag = true;
                        break;

                  case 'End':
                  case 'PageDown':
                        this.setFocusToLastMenuitem(menuId, tgt);
                        flag = true;
                        break;

                  case 'Tab':
                        this.openPopups = false;
                        this.setMenubarDataExpanded('false');
                        this.closePopup(tgt);
                        break;

                  default:
                        if (this.isPrintableCharacter(key)) {
                              this.setFocusByFirstCharacter(menuId, tgt, key);
                              flag = true;
                        }
                        break;
            }

            if (flag) {
                  event.stopPropagation();
                  event.preventDefault();
            }
      }

      handleMenuitemClick(event) {
            var tgt = event.currentTarget;
            var menuId = this.getMenuId(tgt);

            if (this.hasPopup(tgt)) {
                  if (this.isOpen(tgt)) {
                        this.closePopup(tgt);
                  } else {
                        this.closePopupAll(tgt);
                        this.openPopup(menuId, tgt);
                  }
            } else {
                  this.updateContent(tgt.href, tgt.textContent.trim());
                  this.closePopupAll();
            }
            event.stopPropagation();
            event.preventDefault();
      }

      handleMenuitemMouseover(event) {
            var tgt = event.currentTarget;
            var menuId = this.getMenuId(tgt);

            if (this.hasFocus()) {
                  this.setFocusToMenuitem(menuId, tgt);
            }

            if (this.isAnyPopupOpen() || this.hasFocus()) {
                  this.closePopupAll(tgt);
                  if (this.hasPopup(tgt)) {
                        this.openPopup(menuId, tgt);
                  }
            }
      }

      handleBackgroundMousedown(event) {
            if (!this.domNode.contains(event.target)) {
                  this.closePopupAll();
            }
      }
}