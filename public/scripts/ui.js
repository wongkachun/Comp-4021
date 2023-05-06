const SignInForm = (function () {
  // This function initializes the UI
  const initialize = function () {
    // Hide it
    $("#signin-overlay").hide();

    // Submit event for the signin form
    $("#signin-form").on("submit", (e) => {
      // Do not submit the form
      e.preventDefault();

      // Get the input fields
      const username = $("#signin-username").val().trim();
      const password = $("#signin-password").val().trim();

      // Send a signin request
      Authentication.signin(
        username,
        password,
        () => {
          hide();
          UserPanel.update(Authentication.getUser());
          UserPanel.show();

          Socket.connect();
        },
        (error) => {
          $("#signin-message").text(error);
        }
      );
    });

    // Submit event for the register form
    $("#register-form").on("submit", (e) => {
      // Do not submit the form
      e.preventDefault();

      // Get the input fields
      const username = $("#register-username").val().trim();
      const name = $("#register-name").val().trim();
      const password = $("#register-password").val().trim();
      const confirmPassword = $("#register-confirm").val().trim();

      // Password and confirmation does not match
      if (password != confirmPassword) {
        $("#register-message").text("Passwords do not match.");
        return;
      }

      // Send a register request
      Registration.register(
        username,
        name,
        password,
        () => {
          $("#register-form").get(0).reset();
          $("#register-message").text("You can sign in now.");
        },
        (error) => {
          $("#register-message").text(error);
        }
      );
    });
  };

  // This function shows the form
  const show = function () {
    $("#signin-overlay").fadeIn(500);
  };

  // This function hides the form
  const hide = function () {
    $("#signin-form").get(0).reset();
    $("#signin-message").text("");
    $("#register-message").text("");
    $("#signin-overlay").fadeOut(500);
  };

  return { initialize, show, hide };
})();

const UserPanel = (function () {
  // This function initializes the UI
  const initialize = function () {
    // Hide it
    $("#user-panel").hide();

    // Click event for the signout button
    $("#signout-button").on("click", () => {
      // Send a signout request
      Authentication.signout(() => {
        Socket.disconnect();

        hide();
        SignInForm.show();
      });
    });
  };

  // This function shows the form with the user
  const show = function (user) {
    $("#user-panel").show();
  };

  // This function hides the form
  const hide = function () {
    $("#user-panel").hide();
  };

  // This function updates the user panel
  const update = function (user) {
    if (user) {
      $("#user-panel .user-name").text(user.name);
    } else {
      $("#user-panel .user-name").text("");
    }
  };

  return { initialize, show, hide, update };
})();

const UI = (function () {
  // This function gets the user display
  const getUserDisplay = function (user) {
    return $("<div class='field-content row shadow'></div>").append(
      $("<span class='user-name'>" + user.name + "</span>")
    );
  };

  // The components of the UI are put here
  const components = [SignInForm];

  // This function initializes the UI
  const initialize = function () {
    // Initialize the components
    for (const component of components) {
      component.initialize();
    }
  };

  return { getUserDisplay, initialize };
})();

const OnlineUsersStatus = (function () {
  // This function initializes the UI
  const initialize = function () {};

  // This function updates the online users panel
  const update = function (onlineUsers) {
    const playerStatus = document.getElementsByClassName("player-status");

    // Get the current user
    const currentUser = Authentication.getUser();

    // console.log(Object.keys(onlineUsers).length)
    // Add the user
    if (Object.keys(onlineUsers).length > 1) {
      for (const username in onlineUsers) {
        if (username != currentUser.username) {
          playerStatus[0].innerHTML =
            "Player 1 : " + onlineUsers[username].name;
          playerStatus[0].id = username;
          playerName = onlineUsers[username].name;
          player = Player(
            context,
            427,
            240,
            gameArea,
            onlineUsers[username].name
          );
        } else {
          playerStatus[1].innerHTML =
            "Player 2 : " + onlineUsers[username].name;
          playerStatus[1].id = username;
          player2Name = onlineUsers[username].name;
          player2 = Player(
            context,
            500,
            240,
            gameArea,
            onlineUsers[username].name
          );
        }
      }
      document.getElementsByClassName("player-status")[2].style.visibility =
        "visible";
    }
  };

  // This function adds a user in the panel
  const addUser = function (user) {
    const playerStatus = document.getElementsByClassName("player-status");

    // console.log(playerStatus1.innerHTML)
    if (playerStatus[0].innerHTML == "Player 1 : ??? ") {
      playerStatus[0].innerHTML = "Player 1 : " + user.name;
      playerStatus[0].id = user.username;
      playerName = user.name;
      player = Player(context, 427, 240, gameArea, user.name);
    } else {
      playerStatus[1].innerHTML = "Player 2 : " + user.name;
      playerStatus[2].style.visibility = "visible"; // Start game text
      playerStatus[1].id = user.username;
      player2Name = user.name;
      player2 = Player(context, 500, 240, gameArea, user.name);
    }
  };

  return { initialize, update, addUser };
})();

const GamePanel = (function () {
  // This function initializes the UI
  const initialize = function () {};

  const setPlayer = function (x, y, status, name, onlineUsers) {
    const currentUser = Authentication.getUser();
    const playerStatus = document.getElementsByClassName("player-status");

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (currentUser.username == playerStatus[0].id && name == "player2") {
          //isPlayer1
          player2.setStatusLocation(x, y, status);
        } else if (
          currentUser.username != playerStatus[0].id &&
          name == "player1"
        ) {
          player.setStatusLocation(x, y, status);
        }
      }
    }
  };

  const initiatePlayerMove = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (type == 1) {
          player.move(1);
        } else if (type == 2) {
          player.move(2);
        } else if (type == 3) {
          player.move(3);
        } else if (type == 4) {
          player.move(4);
        } else if (type == 5) {
          player2.move(1);
        } else if (type == 6) {
          player2.move(2);
        } else if (type == 7) {
          player2.move(3);
        } else if (type == 8) {
          player2.move(4);
        }
      }
    }
  };

  const initiatePlayerStop = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (type == 1) {
          player.stop(1);
        } else if (type == 2) {
          player.stop(2);
        } else if (type == 3) {
          player.stop(3);
        } else if (type == 4) {
          player.stop(4);
        } else if (type == 5) {
          player2.stop(1);
        } else if (type == 6) {
          player2.stop(2);
        } else if (type == 7) {
          player2.stop(3);
        } else if (type == 8) {
          player2.stop(4);
        }
      }
    }
  };

  const initiatePlayerAttackStart = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (type == 1) {
          player.attackStart();
        } else if (type == 2) {
          player2.attackStart();
        }
      }
    }
  };

  const initiatePlayerAttackStop = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (type == 1) {
          player.attackStop();
        } else if (type == 2) {
          player2.attackStop();
        }
      }
    }
  };

  const checkGameStart = function (onlineUsers) {
    if (Object.keys(onlineUsers).length > 1) {
      gameStart();
    }
  };

  const resetGameEvent = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    if (type == 1) {
      playerReset = true;
      $("#reset-message").show();
    } else if (type == 2) {
      player2Reset = true;
      $("#reset-message").show();
    }

    if (Object.keys(onlineUsers).length > 1) {
      if (playerReset && player2Reset) {
        resetGame();
      }
    }
  };

  const updateGameScores = function (score1, score2) {
    playerScore = score1;
    player2Score = score2;
  };

  const activateCheatMode = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();

    for (const username in onlineUsers) {
      if (username != currentUser.username) {
        if (type == 1) {
          player.speedUp();
        } else if (type == 2) {
          player2.speedUp();
        } else if (type == 3) {
          player.slowDown();
        } else if (type == 4) {
          player2.slowDown();
        }
      }
    }
  };

  return {
    initialize,
    initiatePlayerMove,
    initiatePlayerStop,
    initiatePlayerAttackStart,
    resetGameEvent,
    initiatePlayerAttackStop,
    checkGameStart,
    activateCheatMode,
    updateGameScores,
    setPlayer,
  };
})();

const BoardPanel = (function () {
  // This stores the chat area
  let scoreArea = null;

  // This function initializes the UI
  const initialize = function () {};

  const update = function (leaderboard) {
    // Clear the online users area
    scoreArea = $("#score-area");
    scoreArea.empty();

    leaderboard.sort((a, b) => parseFloat(b.content) - parseFloat(a.content));

    // Add the chat message one-by-one
    count = 0;
    for (const message of leaderboard) {
      if (count == 5) break;
      addScores(message);
      count++;
    }
  };

  const updateBoard = function (type, onlineUsers) {
    const currentUser = Authentication.getUser();
    const playerStatus = document.getElementsByClassName("player-status");

    for (const username in onlineUsers) {
      if (username == currentUser.username) {
        if (currentUser.username == playerStatus[0].id) {
          score = playerScore;
          Socket.postScores(score);
        } else {
          score = player2Score;
          Socket.postScores(score);
        }
      }
    }
  };

  // This function adds a new message at the end of the chatroom
  const addScores = function (message) {
    const datetime = new Date(message.datetime);
    const datetimeString =
      datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();

    scoreArea.append(
      $("<div class='score-message-panel row'></div>")
        .append(UI.getUserDisplay(message.user))
        .append(
          $("<div class='score-message col'></div>")
            // .append($("<div class='score-date'>" + datetimeString + "</div>"))
            .append(
              $("<div class='score-content'>" + message.content + "</div>")
            )
        )
    );
    scoreArea.scrollTop(scoreArea[0].scrollHeight);
  };

  return { initialize, update, addScores, updateBoard };
})();
