var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000, function() {
    console.log("ket noi thanh cong");
});

var mangUsers = [];
app.get("/", function(req, res) {
    res.render("trangchu");
});

io.on("connection", function(socket) {
    console.log("ID ket noi: " + socket.id);
    socket.on("client-send-username", function(data) {
        if (mangUsers.indexOf(data) >= 0) {
            //dang ky that bai
            socket.emit("server-send-dkyFail", data);
        } else {
            //dang ky thanh cong
            mangUsers.push(data);
            socket.Username = data;
            socket.emit("server-send-dkySucces", data);
            io.sockets.emit("server-send-allUser", mangUsers);
        }
    });

    socket.on("user-send-message", function(data) {
        io.sockets.emit("server-send-message", { ten: socket.Username, nd: data });
    });

    socket.on("user-dang-nhap", function(data) {
        socket.broadcast.emit("server-co-ng-nhap", socket.Username);
        if (data >= 2) {
            socket.broadcast.emit("server-co-ng-nhap", data + " người");
        } else {
            socket.broadcast.emit("server-co-ng-nhap", socket.Username);
        }
    });
    socket.on("user-ngung-nhap", function(data) {
        socket.broadcast.emit("server-co-ng-ngung-nhap");
        console.log(data);
    });
    socket.on("user-send-logout", function() {
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-allUser", mangUsers);
    });
    socket.on("disconnect", function() { //socket là biến truyền vào khi được kết nối
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-allUser", mangUsers);
    });
});