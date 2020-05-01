const socket = io('http://localhost:5005')



socket.on('chat-others', (message) => {
    var newmessage=$(`<li class="right clearfix"><span class="chat-img pull-right">
    <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
</span>
    <div class="chat-body clearfix">
        <div class="header">
            <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>13 mins ago</small>
            <strong class="pull-right primary-font">Bhaumik Patel</strong>
        </div>
        <p>
            ${message}
        </p>
    </div>
</li>`)
$(".chat").append(newmessage)
})




$("#form").on('submit', function (event) {
    event.preventDefault()
    myname=$("#myname").text()
    message = $("#btn-input").val()
    socket.emit("chat-message",myname +" : "+ message)
    var newmessage=$(`<li class="right clearfix"><span class="chat-img pull-right">
    <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
</span>
    <div class="chat-body clearfix">
        <div class="header">
            <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>13 mins ago</small>
            <strong class="pull-right primary-font"></strong>
        </div>
        <p>
            ${message}
        </p>
    </div>
</li>`)
    $(".chat").append(newmessage)
    $("#btn-input").val("")
})

