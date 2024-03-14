class menus {
  menus = {};
  food_names = [];
  LIMIT_SEARCH = 2;
  add(data, ID) {
    let keys = Object.keys(data);
    keys.forEach((key) => {
      let item = data[key];
      this.addMenu(item, key, ID);
    });
  }
  addMenu(properties, name, menu_ID) {
    // whats the type of the menu
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
  }

  show(type, limit) {
    //clear the current view
    this.clear();
    if (type == 'all') {
      this.all(this.LIMIT_SEARCH);
    } else {
      this.partial(type, limit);
    }
  }

  partial(type, limit) {
    let parent = $('.detail-wrapper');
    let partial_menu = this.menus[type];
    let keys = Object.keys(partial_menu);
    let len = keys.length;
    limit = limit != null ? limit : len;
    limit = Math.min(limit, len); // prevent to exceed the maximum number of the object

    for (let index = 0; index < limit; index++) {
      const key = keys[index];
      const data = partial_menu[key];
      parent.append(this.createDiv(data));
    }
  }
  all(limit) {
    for (const key in this.menus) {
      if (Object.hasOwnProperty.call(this.menus, key)) {
        this.partial(key, limit);
      }
    }
  }

  createDiv(data) {
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
      Orders.create(data);
    });

    return detail_card;
  }
  clear() {
    $('.detail-wrapper').html('');
  }
  search(keyword) {
    console.log(keyword);

    let found_menus = this.food_names.filter((name) => {
      let menu_name = name['name'];
      let longer = menu_name.length > keyword.length ? menu_name : keyword;
      let shorter = longer == keyword ? menu_name : keyword;
      longer = longer.replace(/[^a-zA-Z]/g, '').toLowerCase();
      shorter = shorter.replace(/[^a-zA-Z]/g, '').toLowerCase();

      return longer.includes(shorter);
    });
    if (found_menus.length == 0) return; // empty array
    this.clear(); // remove all the items
    let parent = $('.detail-wrapper');

    found_menus.forEach((menu) => {
      let key = menu.key;
      let name = menu.name;
      let newDiv = this.createDiv(this.menus[key][name]);
      parent.append(newDiv);
    });
  }
}

class Order {
  Orders = {};
  total = 0;

  create(data) {
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
  }

  createOrder(data) {
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
  }

  update(name, price_total_div, quantity_div, reduce) {
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
  }
  updateTotal() {
    $('#total').text(this.total + '.00');
  }
}

// let object = {};
//   $('.detail-card').each(function (i, obj) {
//     let name = $(obj).find('h4').text();
//     let desc = $(obj).find('.detail-sub').text();
//     let price = $(obj).find('.price').text();
//     let img = $(obj).find('img').attr('src');
//     object[name] = {
//       type: 'burger',
//       desc: desc,
//       price: price,
//       img: img,
//     };
//   });
//   console.log(object);

const Menus = new menus();
const Orders = new Order();
function init() {
  let filter_wrapper = $('.filter-wrapper');

  filter_wrapper.html(''); //remove the categories
  //create all menus for vies
  let all = {
    ID: 'all',
    path: 'utensils',
    title: 'All Menus',
  };
  //create first menu
  filter_wrapper.append(createCategory(all));

  //create the other menus
  for (const iterator in kinds_of_menu) {
    //create the category
    let menu = kinds_of_menu[iterator];
    let filterCard = createCategory({
      title: menu.title,
      ID: menu.ID,
      path: menu.path,
    });
    filter_wrapper.append(filterCard);
    //add menu to the class
    Menus.add(menu.items, menu.ID);
  }
}

function createCategory(data) {
  //creating catergory
  let filterCard = $('<div></div>').addClass('filter-card');
  let icon = $('<div></div>').addClass('filter-icon');
  let imgIcon = $('<img/>').attr('src', 'icons/' + data.path + '.svg');
  icon.append(imgIcon);
  let text = $('<p></p>').text(data.title);
  filterCard.append(icon);
  filterCard.append(text);

  filterCard.on('click', () => {
    showTargetMenus(data.ID);
  });

  return filterCard;
}

function showTargetMenus(ID) {
  Menus.show(ID);
}
function clearOrders() {
  if (Orders.total == 0) return;

  Orders.Orders = {};
  Orders.total = 0;
  $('.orders').html('');
  $('#total').text('0.00');
  $('.orderbar').toggle();
  // open the alert
  $('.alert').css('display', 'grid');
  setTimeout(() => {
    $('.alert').css('display', 'none');
  }, 2500);
}

init();
showTargetMenus('all');
$('.orderbar').toggle();

// search

$('#search').on('keypress', (e) => {
  Menus.search($(e.target).val());
});

//order confirmed
$('#total').on('click', (e) => {
  clearOrders();
});

$('.close').on('click', (e) => {
  $('.orderbar').toggle();
});
$('#cart').on('click', (e) => {
  $('.orderbar').toggle();
});
