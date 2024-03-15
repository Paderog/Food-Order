export function Menus(Order) {
  this.Order = Order;
  this.menus = {};
  this.food_names = [];
  this.LIMIT_SEARCH = 2;
  //add different types of menu, burger, hotdogs, etc.
  this.add = (data, ID) => {
    let keys = Object.keys(data);
    keys.forEach((key) => {
      let item = data[key];
      this.addMenu(item, key, ID);
    });
  };
  //add different menu to their specific type
  this.addMenu = (properties, name, menu_ID) => {
    let menu_name = name; // whats the name of the menu
    this.food_names.push({ name: name, key: menu_ID });
    let menu_description = properties.desc; //description
    let price = properties.price; // price of the menu
    let img = properties.img; // price of the menu
    if (this.menus[menu_ID] == undefined) this.menus[menu_ID] = {};
    // adding menus to the object
    this.menus[menu_ID][menu_name] = {
      name: menu_name,
      desc: menu_description,
      price: price,
      img: img,
    };
  };
  //show the menu to the display
  this.show = (type, limit) => {
    //clear the current view
    this.clear();
    if (type == 'all') {
      this.all(this.LIMIT_SEARCH);
    } else {
      this.partial(type, limit);
    }
  };
  //show only the specific type of menu
  this.partial = (type, limit) => {
    let parent = $('.detail-wrapper');
    let partial_menu = this.menus[type];
    let keys = Object.keys(partial_menu);
    let len = keys.length;
    limit = limit != null ? limit : len;
    limit = Math.min(limit, len); // prevent to exceed the maximum number of the object

    for (let index = 0; index < limit; index++) {
      const key = keys[index];
      const data = partial_menu[key];
      parent.append(this.create(data));
    }
  };
  //show every type of menu
  this.all = (limit) => {
    for (const key in this.menus) {
      if (Object.hasOwnProperty.call(this.menus, key)) {
        this.partial(key, limit);
      }
    }
  };
  //create division for menus
  this.create = (data) => {
    let detail_card = $('<div></div>').addClass('detail-card');
    let img = $('<img/>').addClass('detail-img');
    img.attr('src', data.img); // image soruce
    detail_card.append(img);
    let detail_desc = $('<div></div>').addClass('detail-desc');
    detail_card.append(detail_desc);
    let detail_name = $('<div></div>').addClass('detail-name');
    detail_desc.append(detail_name);
    let h4 = $('<h4></h4>').text(data.name); // the name of the menu
    let p1 = $('<p></p>').addClass('detail-sub').text(data.desc); // decription
    let p2 = $('<p></p>').addClass('price').text(data.price); // decription
    detail_name.append(h4);
    detail_name.append(p1);
    detail_name.append(p2);
    let icon = $('<ion-icon> </ion-icon>')
      .addClass('detail-favorites md hydrated')
      .attr('name', 'bookmark-outline')
      .attr('role', 'img');
    detail_desc.append(icon);
    //adding callback

    detail_card.on('click', () => {
      this.Order.create(data);
    });

    return detail_card;
  };
  //clear the display
  this.clear = () => {
    $('.detail-wrapper').html('');
  };
  //search the names of the menu
  this.search = (keyword) => {
    let found_menus = this.food_names.filter((name) => {
      let menu_name = name['name'];
      //find the shorter lenght of string
      //swap them
      //compare the longer one to the shorter one
      let longer = menu_name.length > keyword.length ? menu_name : keyword;
      let shorter = longer == keyword ? menu_name : keyword;
      longer = longer.replace(/[^a-zA-Z]/g, '').toLowerCase();
      shorter = shorter.replace(/[^a-zA-Z]/g, '').toLowerCase();

      return longer.includes(shorter);
    });
    if (found_menus.length == 0) return; // empty array
    this.clear(); // remove all the items
    let parent = $('.detail-wrapper');
    //create and show the found menus in searching
    found_menus.forEach((menu) => {
      let key = menu.key;
      let name = menu.name;
      let newDiv = this.create(this.menus[key][name]);
      parent.append(newDiv);
    });
  };
}

export function Order() {
  this.Orders = {};
  this.total = 0;

  this.create = (data) => {
    let name = data.name;

    let price = Number(data.price.substring(1));
    //add order

    if (this.Orders[name] == undefined) {
      this.Orders[name] = {
        name: name,
        price: price,
        total: price,
        quantity: 1,
        img: data.img,
      };
      this.total += price;
      this.updateTotal();
      this.createOrder(this.Orders[name]);
      return;
    }
  };

  this.createOrder = (data) => {
    let order_div = $('<div></div>').addClass('order');
    let image = $('<img/>').addClass('order-image');
    image.attr('src', data.img);
    order_div.append(image);
    let name = $('<p/>').addClass('order-name');
    name.text(data.name);
    let price_total = $('<p/>').addClass('order-price');
    price_total.text('₱ ' + data.price);
    order_div.append(name);
    order_div.append(price_total);
    //create button
    let buttons = $('<div></div>').addClass('order-button');
    let decrement = $('<button>-</button>');
    let quantity = $('<p/>').text(1);
    let increament = $('<button>+</button>');
    buttons.append(decrement);
    buttons.append(quantity);
    buttons.append(increament);
    order_div.append(buttons);
    decrement.on('click', () => {
      let order = this.Orders[data.name];
      let quan = order.quantity - 1;
      let price = order.price;
      if (quan == 0) {
        order_div.remove();
        this.total -= price;
        this.updateTotal();
        delete this.Orders[data.name];
        return;
      }

      this.update(data.name, price_total, quantity, -1);
    });
    increament.on('click', () => {
      this.update(data.name, price_total, quantity, 1);
    });

    $('.orders').append(order_div);
  };

  this.update = (name, price_total_div, quantity_div, reduce) => {
    let price = this.Orders[name].price * reduce;
    let total = this.Orders[name].total;
    let quantity = this.Orders[name].quantity;
    this.Orders[name].total = total + price;
    this.Orders[name].quantity = quantity + reduce;
    //update the variable
    total = this.Orders[name].total;
    quantity = this.Orders[name].quantity;
    price_total_div.text('₱ ' + total);
    quantity_div.text(quantity);
    this.total = this.total + price;
    this.updateTotal();
  };

  this.updateTotal = () => {
    $('#total').text(this.total + '.00');
  };

  this.clear = () => {
    if (this.total == 0) return;
    this.Orders = {};
    this.total = 0;
    $('.orders').html('');
    this.updateTotal();
    $('.orderbar').toggle();
    // open the alert
    $('.alert').css('display', 'grid');
    setTimeout(() => {
      $('.alert').css('display', 'none');
    }, 2500);
  };
}

export function Category(Menus) {
  this.Menus = Menus;
  //creating catergory
  this.create = (data) => {
    let filterCard = $('<div></div>').addClass('filter-card');
    let icon = $('<div></div>').addClass('filter-icon');
    let imgIcon = $('<img/>').attr('src', 'icons/' + data.path + '.svg');
    icon.append(imgIcon);
    let text = $('<p></p>').text(data.title);
    filterCard.append(icon);
    filterCard.append(text);

    filterCard.on('click', () => {
      this.Menus.show(data.ID);
    });
    return filterCard;
  };
  this.printer = () => {
    printMe();
  };
}
