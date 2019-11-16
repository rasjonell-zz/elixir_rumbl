import css from "../css/app.css";
import "phoenix_html";

import Video from "./video";
import socket from "./socket";

Video.init(socket, document.getElementById("video"));
