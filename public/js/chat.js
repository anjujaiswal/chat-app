let socket = io();
function scrollToBottom(){
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}
socket.on('connect', ()=>{
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
    socket.emit('join', params, function(err) {
      if(err){
        alert(err);
        window.location.href = '/';
      }else {
        console.log('No Error');
      }
    })

});

socket.on('disconnect', ()=>{
    console.log("disconnect from the server")
});

socket.on('updateUsersList', function(users){
    // console.log(users);
    let ol = document.createElement('ol');
    users.forEach(user => {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
});
socket.on('newMessage', (msg)=>{
    // const formattedTime = moment(message.createdAt).format('LT');
    // const template = document.querySelector('#message-template').innerHTML;
    // const html = Mustache.render(template, {
    //     from: message.from,
    //     text: message.text,
    //     createdAt: formattedTime
    // });

    // const div = document.createElement('div');
    // div.innerHTML = html

    // document.querySelector('#messages').appendChild(div);
    
    const formattedTime = moment(msg.createdAt).format('LT')
    console.log('newMessage--', msg);
    let li = document.createElement('li');
    li.innerText = `${msg.from} ${formattedTime}: ${msg.msg}`;
    document.querySelector('#messages').appendChild(li);
    scrollToBottom();
});

socket.on('newLocationMessage', (msg)=>{
    const formattedTime = moment(msg.createdAt).format('LT')
    console.log('newLocationMessage', msg);
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', msg.url);
    a.innerText = 'My current location';
    li.innerText = `${msg.from}, ${formattedTime}: `;
    li.appendChild(a);
    document.querySelector('#messages').appendChild(li);
    scrollToBottom();
});

// socket.emit('createMessage', {
//     from:'Mike',
//     msg:"hi!"
// }, (message)=>{
//     console.log("got it", message);
// }
// );

document.querySelector('#submit-btn').addEventListener('click',(e)=>{
    e.preventDefault();

socket.emit('createMessage', {
    // from:'User',
    msg:document.querySelector("input[name='message']").value
    }, ()=>{

    });
});


document.querySelector('#send-location').addEventListener('click',(e)=>{
    e.preventDefault();
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((postion) => {
        socket.emit('createGeoLoc', {
            lat: postion.coords.latitude,
            lng : postion.coords.longitude})
    },
    ()=> console.log('Unable to fetch the location'))
});