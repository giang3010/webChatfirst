var socket = io("http://localhost:3000");
var pp = 0;
socket.on("server-send-dkyFail", function(data) {
    alert("Tên " + data + " đã tồn tại!");
});
socket.on("server-send-dkySucces", function(data) {
    $("#currentUser").html(data);
    $("#loginForm").hide(1000);
    $("#chatForm").show(2000);
});
socket.on("server-send-allUser", function(data) {
    $("#boxContent").html("");
    data.forEach(function(i) {
        $("#boxContent").append("<div class='user'>" + i + "</div>");
    });
});
socket.on("server-send-message", function(data) {
    $("#listMessage").append("<div class='message'>" + data.ten + ": " + data.nd + "</div>");
});

socket.on("server-co-ng-nhap", function(data) {
    $("#typing").html(data + " đang nhập...<img width='20px' src='200.gif'>")
});
socket.on("server-co-ng-ngung-nhap", function() {
    $("#typing").html("");
});
$(document).ready(function() {
    $("#loginForm").show();
    $("#chatForm").hide();
    $("#btnConfirm").click(function() {
        socket.emit("client-send-username", $("#txtUsername").val());

    });
    $("#btnLogout").click(function() {
        socket.emit("user-send-logout");
        $("#loginForm").show(1500);
        $("#chatForm").hide(1000);
    });
    $("#btnMessage").click(function() {
        socket.emit("user-send-message", $("#txtMessage").val());
        document.getElementById('txtMessage').value = '';
    });
    $("#txtMessage").focusin(function() {
        socket.emit("user-dang-nhap", pp = pp + 1);
    });
    $("#txtMessage").focusout(function() {
        socket.emit("user-ngung-nhap", pp = pp - 1);
    });
});