var Packet = require('./packet');

function PacketHandler(gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
    this.merg = false;
    this.pressW = false;
    this.pressSpace = false;
	this.massSize = false;
	this.pressQ = false;
}
function parse(input) {
  let out =  input.split(" "); 
  return out
}
module.exports = PacketHandler;

PacketHandler.prototype.handleMessage = function(message) {
    function stobuf(buf) {
        var length = buf.length;
        var arrayBuf = new ArrayBuffer(length);
        var view = new Uint8Array(arrayBuf);

        for (var i = 0; i < length; i++) {
            view[i] = buf[i];
        }

        return view.buffer;
    }

    var buffer = stobuf(message);
    var view = new DataView(buffer);
    var packetId = view.getUint8(0, true);

    switch (packetId) {
        case 0:
            // Set Nickname
            var nick = "";
            for (var i = 1; i < view.byteLength; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }

                nick += String.fromCharCode(charCode);
            }
            this.setNickname(nick);
            break;
        case 1:
            // Spectate mode
            if (this.socket.playerTracker.cells.length <= 0) {
                // Make sure client has no cells
                this.socket.playerTracker.spectate = true;
            }
            break;
        case 16:
            // Mouse Move
            var client = this.socket.playerTracker;
            client.mouse.x = view.getFloat64(1, true);
            client.mouse.y = view.getFloat64(9, true);
            break;

		case 17: 
            // Space Press - Split cell
            this.pressSpace = true;
            break;
		    	 case 87:
this.massSize = true;
		    break;
		     case 52:
this.merg = true;
		    break;
        case 21: 
            // W Press - Eject mass
          var eex = this.socket.playerTracker;
  if(eex.bomber){
this.pressQ = true
} else {
this.pressW = true;
}
            break;
		     case 18: 
            // W Press - Eject mass
        var eex = this.socket.playerTracker;
        if(eex.admin) {
        this.pressQ = true;
        }
            break;
        case 42:
            var message = "";
            for (var i = 1; i < view.byteLength; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }

                message += String.fromCharCode(charCode);
            }
            
            this.gameServer.sendMessage(message);
        case 255:
            // Connection Start - Send SetBorder packet first
            var c = this.gameServer.config;
            this.socket.sendPacket(new Packet.SetBorder(c.borderLeft, c.borderRight, c.borderTop, c.borderBottom));
            break;
         case 99:
            var message = "";
            var maxLen = 200 * 2; // 2 bytes per char
            var offset = 2;
            var flags = view.getUint8(1); // for future use (e.g. broadcast vs local message)
            if (flags & 2) {
                offset += 4;
            }
            if (flags & 4) {
                offset += 8;
            }
            if (flags & 8) {
                offset += 16;
            }
            for (var i = offset; i < view.byteLength && i <= maxLen; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }
                message += String.fromCharCode(charCode);
            }
            var packet = new Packet.Chat(this.socket.playerTracker, message);
       var packet2 = new Packet.Chat(this.socket.playerTracker, "/tableflip - appends (╯°□°）╯︵ ┻━┻ on your message", true);
         var packet3 = new Packet.Chat(this.socket.playerTracker, "/unflip - appends ┬─┬ ノ( ゜-゜ノ) on your message", true);
        var packet4 = new Packet.Chat(this.socket.playerTracker, "/shrug - appends \_(ツ)_/¯ on your message", true);
        var tableflip = new Packet.Chat(this.socket.playerTracker, "(╯°□°）╯︵ ┻━┻", false);
         var unflip = new Packet.Chat(this.socket.playerTracker, "┬─┬ ノ( ゜-゜ノ)", false);
         var shrug = new Packet.Chat(this.socket.playerTracker, "¯\_(ツ)_/¯", false);
            // Send to all clients (broadcast)
            for (var i = 0; i < this.gameServer.clients.length; i++) {
                if(message == "/help"){
            this.gameServer.clients[i].sendPacket(packet2);
                  this.gameServer.clients[i].sendPacket(packet3);
                  this.gameServer.clients[i].sendPacket(packet4);
               } else if(message == "/tableflip") {
                  this.gameServer.clients[i].sendPacket(tableflip);   
                  } else if(message == "/unflip") {
                  this.gameServer.clients[i].sendPacket(unflip);
                     } else if(message == "/shrug") {
                  this.gameServer.clients[i].sendPacket(shrug);
              } else if(message.startsWith("/login ")) {
                       var s_command = parse(message)
                        var dominions = s_command[1]
                        if(dominions == "DootDoot3") {
                           var succ = this.socket.playerTracker;
                          console.log("Yea")
                          succ.admin = true;
                                      }
                        } else if(message == ("/bomber")) {
                       //var rosen = parse(message)
                        //var mem = rosen[1]
                       var eex = this.socket.playerTracker;
                       var weew = this.socket.playerTracker;
                        if(eex.admin) {
                          weew.bomber = true
                          console.log(22)
                                      } else {
                                    console.log(99)
                                      }
		     } else {
              this.gameServer.clients[i].sendPacket(packet);
               }
            }
            break;
default:
            break;
    }
}

PacketHandler.prototype.setNickname = function(newNick) {
    var client = this.socket.playerTracker;
    if (client.cells.length < 1) {
        // If client has no cells... then spawn a player
        this.gameServer.spawnPlayer(client);
        
        // Turn off spectate mode
        client.spectate = false;
    }
		if(newNick.toLowerCase().split("*")[0].includes("baby shark") || newNick.toLowerCase().split("*")[0] === "tech right" || newNick.toLowerCase().split("*")[0] === "fortnite" || newNick.toLowerCase().split("*")[0] === "johnny johnny" || newNick.toLowerCase().split("*")[0] === "yes papa" || newNick.toLowerCase().split("*")[0] === "illumination"|| newNick.toLowerCase().split("*")[0] === "anonymous" || newNick.toLowerCase().split("*")[0] === "goanimate"|| newNick.toLowerCase().split("*")[0] === "i support peta") {
     shruck = newNick.split("*")[1]
    client.setName("KYS" + "*"+ shruck)
  } else {
  if(newNick.split("*")[0] == "") {
     naeme = newNick.split("*")[1]
	  client.setName("LennyAgar..."+ "*" + naeme)
  } else {
    client.setName(newNick);
  }
  }
}
