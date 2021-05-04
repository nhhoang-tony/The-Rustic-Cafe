
document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    homepages = document.querySelectorAll('.homepage').forEach(function(homepage) {
        homepage.addEventListener('click', () => home_page());
        });
    menus = document.querySelectorAll('.menu').forEach(function(menu) {
        menu.addEventListener('click', () => get_menu());
        });
    galleries = document.querySelectorAll('.gallery').forEach(function(gallery) {
        gallery.addEventListener('click', () => get_gallery());
        });
    contacts = document.querySelectorAll('.contact').forEach(function(contact) {
        contact.addEventListener('click', () => get_contact());
        });
  
    // By default, load the inbox
    home_page();

    // remove # from url
    window.onscroll = () => {
        history.pushState("", document.title, window.location.pathname);
    }

    // always move to top of page when reloads
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }

    // change header menu if scroll
    $(function () {
        $(document).scroll(function () {
            var $nav = $(".navbar");
            $nav.toggleClass('scrolled', $(this).scrollTop() > 200);
          });
      });

    // close collapse header menu if clicked
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    // like_icon on gallery page
    $("#gallery-container").on('click', '.like-icon', function() {
        update_like(this);
    })

    // load more picture
    load_more = document.getElementById('gallery-load-more');
    load_more.addEventListener('click', function() {
        pic_count = document.querySelector('.gallery-container').childElementCount - 3;
        load_more_picture(Math.ceil((pic_count  + 1)/ 9));
    });

    // send message 
    document.getElementById("send_message").addEventListener("submit", function(event){
        event.preventDefault();
        send_message();
      });

    // update page visit count
    get_visit();
  });

// display homepage
function home_page() {
    // turn off all other pages and header bar
    document.getElementById('homepage').style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('contact').style.display = 'none';

    document.getElementById('header-homepage').style.fontWeight = 'bold';
    document.getElementById('header-homepage').style.textDecoration = 'underline';
    document.getElementById('header-menu').style.fontWeight = 'normal';
    document.getElementById('header-menu').style.textDecoration = 'initial';
    document.getElementById('header-gallery').style.fontWeight = 'normal';
    document.getElementById('header-gallery').style.textDecoration = 'initial';
    document.getElementById('header-contact').style.fontWeight = 'normal';
    document.getElementById('header-contact').style.textDecoration = 'initial';

    // auto scroll to top if user change page
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// display menu page
function get_menu() {
    // turn off all other pages and header bar
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('contact').style.display = 'none';

    document.getElementById('header-homepage').style.fontWeight = 'normal';
    document.getElementById('header-homepage').style.textDecoration = 'initial';
    document.getElementById('header-menu').style.fontWeight = 'bold';
    document.getElementById('header-menu').style.textDecoration = 'underline';
    document.getElementById('header-gallery').style.fontWeight = 'normal';
    document.getElementById('header-gallery').style.textDecoration = 'initial';
    document.getElementById('header-contact').style.fontWeight = 'normal';
    document.getElementById('header-contact').style.textDecoration = 'initial';

    // auto scroll to top if user change page
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // get menu from dynamoDB
    get_dynamo_menu();
}

// gallary page
function get_gallery() {
    // turn off all other pages and header bar
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
    document.getElementById('contact').style.display = 'none';

    document.getElementById('header-homepage').style.fontWeight = 'normal';
    document.getElementById('header-homepage').style.textDecoration = 'initial';
    document.getElementById('header-menu').style.fontWeight = 'normal';
    document.getElementById('header-menu').style.textDecoration = 'initial';
    document.getElementById('header-gallery').style.fontWeight = 'bold';
    document.getElementById('header-gallery').style.textDecoration = 'underline';
    document.getElementById('header-contact').style.fontWeight = 'normal';
    document.getElementById('header-contact').style.textDecoration = 'initial';

    // auto scroll to top if user change page
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // get picture from S3 bucket
    get_s3_pictures();

    // generate random likes on pictures
    random_likes = document.querySelectorAll('.like-count').forEach(function(random_like) {
        random_like.innerHTML = formatNumber(Math.floor(Math.random() * 10000));
    })
}

// contact page
function get_contact() {
    // turn off all other pages and header bar
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('contact').style.display = 'block';

    document.getElementById('header-homepage').style.fontWeight = 'normal';
    document.getElementById('header-homepage').style.textDecoration = 'initial';
    document.getElementById('header-menu').style.fontWeight = 'normal';
    document.getElementById('header-menu').style.textDecoration = 'initial';
    document.getElementById('header-gallery').style.fontWeight = 'normal';
    document.getElementById('header-gallery').style.textDecoration = 'initial';
    document.getElementById('header-contact').style.fontWeight = 'bold';
    document.getElementById('header-contact').style.textDecoration = 'underline';

    // auto scroll to top if user change page
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


// global variable
var menu;
// API call to get menu from dynamoDB
async function get_dynamo_menu() {
    // only get menu once when first load page
    if (menu == null) {
        // instantiate a headers object
        var myHeaders = new Headers();
        // add content type header to object
        myHeaders.append("Content-Type", "application/json");
        // using built in JSON utility package turn object to string and store in a variable
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        // make API call with parameters and use promises to get response
        let data = await fetch("https://lp30qsvq56.execute-api.ap-southeast-2.amazonaws.com/prod", requestOptions)
        .then(response => response.text())
        .then(result => {return JSON.parse(result).body;})
        .catch(error => console.log('error', error));

        // sort JSON result from unsorted DynamoDB scan()
        var menu = JSON.parse(data);
        //menu.sort(function(a,b){return a.id - b.id;});
        menu.sort(function(a,b) {
            if (a.category == b.category) {
                return (a.name > b.name) ? 1 : -1;
            }
            return (a.category > b.category) ? 1 : -1;
        })

        // print out menu to user
        load_menu(menu);
    }
}

// create html elements and print out menu
function load_menu(menu) {
    // menu tab, menu section, drink tab and drink section
    menu_tab = document.createElement('div');
    menu_tab.setAttribute('class', 'menu-tab');
    menu_tab.setAttribute('id', 'menu-tab');

    drink_tab = document.createElement('div');
    drink_tab.setAttribute('class', 'menu-tab-drink');
    drink_tab.setAttribute('id', 'menu-tab-drink');

    // variables to iterate though menu
    var current_category = '';
    var current_type = '';
    var all_menu_tab = [];
    var all_menu_section = [];
    var all_drink_tab = [];
    var all_drink_section = [];
    var tab_item_count = 0;
    var section_item_count = 0;
    var tab_item_count_drink = 0;
    var section_item_count_drink = 0;
    each_section_holder = document.createElement('div');

    // iterate through menu for food section
    for (var i = 0; i < menu.length; i++) {
        // check if reach new category
        if (menu[i].category != current_category) {
            // create new button
            // check if new category is food or drink
            if (menu[i].type == 'FOOD') {
                all_menu_tab[tab_item_count] = document.createElement('div');
                all_menu_tab[tab_item_count].setAttribute('class', `each-menu-tab middle ${menu[i].category}`);
                all_menu_tab[tab_item_count].setAttribute('onclick', `get_menu_section('${menu[i].category}')`);

                if (menu[i].category === 'ALL-DAY-BREAKFAST') {
                    all_menu_tab[tab_item_count].innerHTML = '<div class="middle">breakfast</div>';
                }
                else {
                    all_menu_tab[tab_item_count].innerHTML = `<div class="middle">${menu[i].category.replace(/-/g, " ").toLowerCase()}</div>`;
                }
                tab_item_count++;
            }
            else {
                all_drink_tab[tab_item_count_drink] = document.createElement('div');
                all_drink_tab[tab_item_count_drink].setAttribute('class', `each-menu-tab-drink middle ${menu[i].category}`);
                all_drink_tab[tab_item_count_drink].setAttribute('onclick', `get_menu_drink('${menu[i].category}')`);
                all_drink_tab[tab_item_count_drink].innerHTML = `<div class="middle">${menu[i].category.replace(/-/g, " ").toLowerCase()}</div>`;
                tab_item_count_drink++;
            }
            
            // create new menu section
            // if it's the first item in menu 
            if (i == 0) {
                // check if it's food or drink
                if (menu[i].type == 'FOOD') {
                    all_menu_section[section_item_count] = document.createElement('div');
                    all_menu_section[section_item_count].setAttribute('class', 'section menu-container');
                    all_menu_section[section_item_count].setAttribute('id', `${menu[i].category}`);
                    current_category = menu[i].category;
                    current_type = menu[i].type;
                }
                else {
                    all_drink_section[section_item_count_drink] = document.createElement('div');
                    all_drink_section[section_item_count_drink].setAttribute('class', 'section-drink menu-container');
                    all_drink_section[section_item_count_drink].setAttribute('id', `${menu[i].category}`);
                    current_category = menu[i].category;
                    current_type = menu[i].type;
                }
            }
            // if reach new category midway through menu
            else {
                // copy all item within category and reset holder
                if (current_type == 'FOOD') {
                    all_menu_section[section_item_count].innerHTML = each_section_holder.innerHTML;
                    each_section_holder.innerHTML = '';
                    section_item_count++;
                }
                else {
                    all_drink_section[section_item_count_drink].innerHTML = each_section_holder.innerHTML;
                    each_section_holder.innerHTML = '';
                    section_item_count_drink++;
                }

                // create new menu section
                if (menu[i].type == 'FOOD') {
                    all_menu_section[section_item_count] = document.createElement('div');
                    all_menu_section[section_item_count].setAttribute('class', 'section menu-container');
                    all_menu_section[section_item_count].setAttribute('id', `${menu[i].category}`);
                    current_category = menu[i].category;
                    current_type = menu[i].type;
                }
                else {
                    all_drink_section[section_item_count_drink] = document.createElement('div');
                    all_drink_section[section_item_count_drink].setAttribute('class', 'section-drink menu-container');
                    all_drink_section[section_item_count_drink].setAttribute('id', `${menu[i].category}`);
                    current_category = menu[i].category;
                    current_type = menu[i].type;
                }
            }
                // add the new item in new category to holder
                each_item = document.createElement('div');
                each_item.setAttribute('class', 'each-menu-item');
                each_item.setAttribute('id', `${menu[i].id}_each_item`);

                item_container = document.createElement('div');
                item_container.setAttribute('id', `${menu[i].id}_content`);

                item_name = document.createElement('div');
                item_name.setAttribute('class', 'item-name');
                item_name.setAttribute('id', `${menu[i].id}_item_name`);
                item_name.innerHTML = menu[i].name;

                item_detail = document.createElement('div');
                item_detail.setAttribute('class', 'item-details');
                item_detail.setAttribute('id', `${menu[i].id}_item_detail`);
                item_detail.innerHTML = menu[i].description;

                item_price = document.createElement('div');
                item_price.setAttribute('class', 'item-price');
                item_price.setAttribute('id', `${menu[i].id}_item_price`);
                item_price.innerHTML = menu[i].price;

                item_container.append(item_name);
                item_container.append(item_detail);
                item_container.append(item_price);

                each_item.append(item_container);
                each_section_holder.append(each_item);

                // check if last reach end of menu
                if (i == menu.length - 1) {
                    // copy all item for last category
                    if (menu[i].type == 'FOOD') {
                        all_menu_section[section_item_count].innerHTML = each_section_holder.innerHTML;
                    } else {
                        all_drink_section[section_item_count_drink].innerHTML = each_section_holder.innerHTML;
                    }
                }
        }
        // else if still within category
        else {
            // check if reach the end of menu
            if (i == menu.length - 1) {
                // add the last item to holder
                each_item = document.createElement('div');
                each_item.setAttribute('class', 'each-menu-item');
                each_item.setAttribute('id', `${menu[i].id}_each_item`);

                item_container = document.createElement('div');
                item_container.setAttribute('id', `${menu[i].id}_content`);

                item_name = document.createElement('div');
                item_name.setAttribute('class', 'item-name');
                item_name.setAttribute('id', `${menu[i].id}_item_name`);
                item_name.innerHTML = menu[i].name;

                item_detail = document.createElement('div');
                item_detail.setAttribute('class', 'item-details');
                item_detail.setAttribute('id', `${menu[i].id}_item_detail`);
                item_detail.innerHTML = menu[i].description;

                item_price = document.createElement('div');
                item_price.setAttribute('class', 'item-price');
                item_price.setAttribute('id', `${menu[i].id}_item_price`);
                item_price.innerHTML = menu[i].price;

                item_container.append(item_name);
                item_container.append(item_detail);
                item_container.append(item_price);

                each_item.append(item_container);
                each_section_holder.append(each_item);

                // copy all item for last category
                if (menu[i].type == 'FOOD') {
                    all_menu_section[section_item_count].innerHTML = each_section_holder.innerHTML;
                } else {
                    all_drink_section[section_item_count_drink].innerHTML = each_section_holder.innerHTML;
                }
                
            }
            // if within category and not at end of menu, add to holder
            else {
                each_item = document.createElement('div');
                each_item.setAttribute('class', 'each-menu-item');
                each_item.setAttribute('id', `${menu[i].id}_each_item`);

                item_container = document.createElement('div');
                item_container.setAttribute('id', `${menu[i].id}_content`);

                item_name = document.createElement('div');
                item_name.setAttribute('class', 'item-name');
                item_name.setAttribute('id', `${menu[i].id}_item_name`);
                item_name.innerHTML = menu[i].name;

                item_detail = document.createElement('div');
                item_detail.setAttribute('class', 'item-details');
                item_detail.setAttribute('id', `${menu[i].id}_item_detail`);
                item_detail.innerHTML = menu[i].description;

                item_price = document.createElement('div');
                item_price.setAttribute('class', 'item-price');
                item_price.setAttribute('id', `${menu[i].id}_item_price`);
                item_price.innerHTML = menu[i].price;

                item_container.append(item_name);
                item_container.append(item_detail);
                item_container.append(item_price);

                each_item.append(item_container);
                each_section_holder.append(each_item);
            }   
        }
    }

    // append everything to menu page
    menu_go_here = document.getElementById('menu-go-here');

    for (var i = 0; i < all_menu_tab.length; i++) {
        menu_tab.append(all_menu_tab[i]);
    }
    menu_go_here.append(menu_tab);

    for (var i = 0; i < all_menu_section.length; i++) {
        menu_go_here.append(all_menu_section[i]);
    }

    for (var i = 0; i < all_drink_tab.length; i++) {
        drink_tab.append(all_drink_tab[i]);
    }
    menu_go_here.append(drink_tab);

    for (var i = 0; i < all_drink_section.length; i++) {
        menu_go_here.append(all_drink_section[i]);
    }

    breakfast_hot_drink();
}

// auto loads breakfast and hot drink options
function breakfast_hot_drink() {
    // auto loads breakfast option
    var menu_section = document.getElementsByClassName("section");
    for (var i = 0; i < menu_section.length; i++) {
        menu_section[i].style.display = "none"; 
        if (i == 0) {
            menu_section[i].style.display = "flex";
        }
    }
    // document.getElementById('ALL-DAY-BREAKFAST').style.display = 'flex';
    
    var menu_tab = document.getElementsByClassName("each-menu-tab");
    for (var i = 0; i < menu_tab.length; i++) {
        menu_tab[i].style.backgroundColor= "white";
        menu_tab[i].style.color= "black"; 
        if (i == 0) {
            menu_tab[i].style.backgroundColor = "black";
            menu_tab[i].style.color = "white";
        }
    }
    // document.querySelector(`.ALL-DAY-BREAKFAST`).style.backgroundColor= "black";
    // document.querySelector(`.ALL-DAY-BREAKFAST`).style.color= "white";

    // auto loads hot drink option
    var drink_section = document.getElementsByClassName("section-drink");
    for (var i = 0; i < drink_section.length; i++) {
        drink_section[i].style.display = "none"; 
        if (i == 0) {
            drink_section[i].style.display = "flex";
        }
    }
    // document.getElementById('HOT-DRINKS').style.display = 'flex';

    var drink_tab = document.getElementsByClassName("each-menu-tab-drink");
    for (var i = 0; i < drink_tab.length; i++) {
        drink_tab[i].style.backgroundColor= "white";
        drink_tab[i].style.color= "black"; 
        if (i == 0) {
            drink_tab[i].style.backgroundColor = "black";
            drink_tab[i].style.color = "white";
        }
    }
    // document.querySelector(`.HOT-DRINKS`).style.backgroundColor= "black";
    // document.querySelector(`.HOT-DRINKS`).style.color= "white";
}

// switch among menu tabs if user click
function get_menu_section(section) {
    // clear all other tabs
    var menu_section = document.getElementsByClassName("section");
    for (var i = 0; i < menu_section.length; i++) {
        // if tab is currently open and different from new tab, start animation
        if (menu_section[i].style.display == 'flex' && menu_section[i].getAttribute('id') !== section)  {
            current_section = menu_section[i];
            current_section.style.animationPlayState = 'running';

            // after animation
            current_section.addEventListener('animationend', () => {

                // reset animation
                current_section.style.animationPlayState = 'paused';
                current_section.classList.remove('section');
                void current_section.offsetWidth;
                current_section.classList.add('section');

                // close current menu tab and section
                current_section.style.display = "none";
                document.querySelector(`.${current_section.getAttribute('id')}`).style.backgroundColor= "white";
                document.querySelector(`.${current_section.getAttribute('id')}`).style.color= "black";
            });
            // show next menu tab and section
            setTimeout(function() {
                document.getElementById(section).style.display = "flex";
                document.querySelector(`.${section}`).style.backgroundColor= "black";
                document.querySelector(`.${section}`).style.color= "white";
                }, 450);
            // break loop if found next section
            break;
        }
    }
}

// switch among drink tabs if user click
function get_menu_drink(section) {
    // clear all other tabs
    var drink_section = document.getElementsByClassName("section-drink");
    for (var i = 0; i < drink_section.length; i++) {

        // if tab is currently open and different from new tab, start animation
        if (drink_section[i].style.display == 'flex' && drink_section[i].getAttribute('id') != section)  {
            current_section = drink_section[i];
            current_section.style.animationPlayState = 'running';
            
            // after animation
            current_section.addEventListener('animationend', () => {

                // reset animation
                current_section.style.animationPlayState = 'paused';
                current_section.classList.remove('section-drink');
                void current_section.offsetWidth;
                current_section.classList.add('section-drink');

                // close current menu tab and section
                current_section.style.display = "none";
                document.querySelector(`.${current_section.getAttribute('id')}`).style.backgroundColor= "white";
                document.querySelector(`.${current_section.getAttribute('id')}`).style.color= "black";
                
                // show new menu tab and section
                document.getElementById(section).style.display = "flex";
                document.querySelector(`.${section}`).style.backgroundColor= "black";
                document.querySelector(`.${section}`).style.color= "white";
            });
        }
    }
}


// global variable
var gallery;
// API call to get pictures from s3
async function get_s3_pictures() {
    // only fetch pictures when first loaded
    if (gallery == null) {
        // instantiate a headers object
        var myHeaders = new Headers();
        // add content type header to object
        myHeaders.append("Content-Type", "application/json");
        // using built in JSON utility package turn object to string and store in a variable
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        // make API call with parameters and use promises to get response
        let data = await fetch("https://hau5jajds9.execute-api.ap-southeast-2.amazonaws.com/prod", requestOptions)
        .then(response => response.text())
        .then(result => {return JSON.parse(result).body;})
        .catch(error => console.log('error', error));

        // sort JSON result based on latest pictures
        gallery = JSON.parse(data);
        load_more_picture(1);
    }
}

// shows more picture when users click on load more ...
function load_more_picture(click_time) {
    // if all gallery is shown, display message to user
    if (document.querySelector('.gallery-container').childElementCount - 3 >= gallery.Contents.length) {
        document.getElementById('gallery-message').style.display = 'block';
    }
    else {
        // update gallery page from retrieved picture urls
        gallery_html = document.createElement('div');
        gallery_html.setAttribute('class', 'gallery-container background');

        direct_append = document.querySelector('.gallery-container');

        for (var i = (click_time - 1) * 9; i < ((gallery.Contents.length < (click_time * 9)) ? gallery.Contents.length : (click_time * 9)); i++) {
            each_image = document.createElement('div');
            each_image.setAttribute('class', 'gallery-container-each-image');

            like = document.createElement('span');
            like.setAttribute('class', 'like-count');
            like.setAttribute('id', `${gallery.Contents[i].Key}_count`);
            like.innerHTML = formatNumber(Math.floor(Math.random() * 10000));

            image_box = document.createElement('div');
            image_box.setAttribute('class', 'box');

            image = document.createElement('img');
            image.setAttribute('class', 'gallery-image');
            image.setAttribute('id', `${gallery.Contents[i].Key}_image`);
            image.setAttribute('src', `https://s3-tony-the-rustic-cafe.s3-ap-southeast-2.amazonaws.com/${gallery.Contents[i].Key}`);

            like_icon = document.createElement('img');
            like_icon.setAttribute('class', 'like-icon');
            like_icon.setAttribute('id', `${gallery.Contents[i].Key}_icon`);
            like_icon.setAttribute('src', 'images/little-heart.jpg');

            each_image.append(like);
            image_box.append(image);
            image_box.append(like_icon);
            each_image.append(image_box);

            direct_append.append(each_image);
        }
    }
}

// when user click on like button in gallery
function update_like(like_icon) {
    // get all required field
    let image_id = like_icon.getAttribute('id'); // id_icon
    let like_count = document.getElementById(`${image_id.replace('_icon','_count')}`);

    // update like
    string = like_count.innerHTML;
    current_count = parseInt(string.replace(/,/g, ""));
    update_count = current_count + 1;
    like_count.innerHTML = formatNumber(update_count);

    // start animation
    //like_animation = document.getElementById(`${image_id.split("_")[0]}_icon`);
    like_icon.style.animationPlayState = 'running';
    like_icon.addEventListener('animationend', () => {
        // reset animation
        like_icon.classList.remove('like-icon');
        void like_icon.offsetWidth;
        like_icon.classList.add('like-icon');
        like_icon.style.animationPlayState = 'paused';
    });

    like_count.style.animationPlayState = 'running';
    like_count.addEventListener('animationend', () => {
        // reset animation
        like_count.classList.remove('like-count');
        void like_count.offsetWidth;
        like_count.classList.add('like-count');
        like_count.style.animationPlayState = 'paused';
    });
}


// send a message via API function
function send_message() {
    // get all required fields
    let guest_name = document.querySelector('#name').value;
    let guest_phone = document.querySelector('#phone').value;
    let guest_email = document.querySelector('#email').value;
    let guest_message = document.querySelector('#message').value;

    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"Name":guest_name,"Phone":guest_phone,"Email":guest_email,"Message":guest_message});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // send message by making API calls 
    fetch("https://49jor2d89l.execute-api.ap-southeast-2.amazonaws.com/prod", requestOptions)
    .then(response => response.text())
    .then(result => {
        alert(JSON.parse(result).body);
        get_contact();
    })
    .catch(error => console.log('error', error));
}


// format number for like count
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

// remove # from url
function remove_hash() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

// get page visit count
async function get_visit() {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // make API call with parameters and use promises to get response
    let data = await fetch("https://lff8ghifme.execute-api.ap-southeast-2.amazonaws.com/prod", requestOptions)
    .then(response => response.text())
    .then(result => {return JSON.parse(result).body;})
    .catch(error => console.log('error', error));
    
    var count;
    var domains = JSON.parse(data);
    for (let i = 0; i < domains.length; i++){
        if (domains[i].domain == 'rusticcafe.com.au') {

            count = domains[i].count;
        }
    }
    increment_visit(count + 1);
}

// update page visit count
function increment_visit(count) {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"count":count, "domain": "rusticcafe.com.au"});
    // using built in JSON utility package turn object to string and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // make API call with parameters and use promises to get response
    fetch("https://sspb2z8a24.execute-api.ap-southeast-2.amazonaws.com/prod", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result);
        console.log(count);
    })
    .catch(error => console.log('error', error));
}