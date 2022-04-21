const { PlayFab, PlayFabAdmin, PlayFabServer } = require('playfab-sdk');
var GAME_ID = '238E6';
PlayFab.settings.titleId = GAME_ID;
PlayFab.settings.developerSecretKey =
  '1YP575JK5RZOJFRMMSAT5DWWOG9FI6967KNH3YCCIKFQT7SNK7';

function replacer(key, value) {
  //Credits: https://stackoverflow.com/users/696535/pawel
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value],
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  //Credits: https://stackoverflow.com/users/696535/pawel
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}


function getElementFromArray(element, customIdentifier, array) {
  let tempElement;
  array.forEach((arrayElement) => {
    if (arrayElement[customIdentifier] === element[customIdentifier]) {
      tempElement = arrayElement;
    }
  });
  return tempElement != undefined ? tempElement : false;
}

function getElementFromArrayByValue(value, customIdentifier, array) {
  let tempElement;
  array.forEach((arrayElement) => {
    if (arrayElement[customIdentifier] == value) {
      tempElement = arrayElement;
    }
  });
  return tempElement != undefined ? tempElement : false;
}

function checkIfElementIsInArray(element, customIdentifier, array) {
  return functions.getElementFromArray(element, customIdentifier, array)
    ? true
    : false;
}

function removeElementFromArray(element, array) {
  array.splice(array.indexOf(element), 1);
}


function resetTimer(timer, time) {
  clearTimeout(timer.isAFK);
  timer.isAFK = setTimeout(() => {
    timer.disconnect(true);
  }, time);
}


async function getPlayfabUserByUsername(username) {
  return await new Promise((resolve, reject) => {
    PlayFabAdmin.GetUserAccountInfo({ Username: username }, (error, result) => {
      if (result !== null) {
        resolve(result);
      } else if (error !== null) {
        reject(error);
      }
    });
  });
}

async function getPlayersInSegment(SegmentId) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.GetPlayersInSegment(
      { SegmentId: SegmentId },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}

async function getPlayerTags(PlayFabId) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.GetPlayerTags({ PlayFabId: PlayFabId }, (error, result) => {
      if (result !== null) {
        resolve(result);
      } else if (error !== null) {
        reject(error);
      }
    });
  });
}

async function addPlayerTag(PlayfabId, tag) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.AddPlayerTag(
      { PlayFabId: PlayfabId, TagName: tag },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}

async function removePlayerTag(PlayFabId, TagName) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.RemovePlayerTag(
      { PlayFabId: PlayFabId, TagName: TagName },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}

async function getPlayerInternalData(PlayFabId) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.GetUserInternalData(
      { PlayFabId: PlayFabId },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}


function separateString(string) {
  if (string == undefined) return;
  let separated = string.split(' ');
  return separated;
}


async function grantItemsToUser(CatalogVersion, ItemIds, PlayFabId) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.GrantItemsToUser(
      {
        CatalogVersion: CatalogVersion,
        ItemIds: ItemIds,
        PlayFabId: PlayFabId,
      },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}

async function changeUserDisplayName(DisplayName, PlayfabId) {
  return await new Promise((resolve, reject) => {
    PlayFabAdmin.UpdateUserTitleDisplayName(
      { DisplayName: DisplayName, PlayFabId: PlayfabId },
      (error, result) => {
        if (result !== null) {
          resolve(result);
        } else if (error !== null) {
          reject(error);
        }
      }
    );
  });
}


async function getPlayerInventory(playerId) {
  return await new Promise((resolve, reject) => {
    PlayFabAdmin.GetUserInventory({ PlayFabId: playerId }, (error, result) => {
      if (result !== null) {
        resolve(result);
      } else if (error !== null) {
        reject(error);
      }
    });
  });
}

async function getFriendsList(playerId) {
  return await new Promise((resolve, reject) => {
    PlayFabServer.GetFriendsList({ PlayFabId: playerId }, (error, result) => {
      if (result !== null) {
        resolve(result);
      } else if (error !== null) {
        reject(error);
      }
    });
  });
}

module.exports = {
  replacer,
  reviver,

  getElementFromArray,
  getElementFromArrayByValue,
  checkIfElementIsInArray,
  removeElementFromArray,

  resetTimer,

  getPlayfabUserByUsername,
  getPlayersInSegment,
  getPlayerTags,
  addPlayerTag,
  removePlayerTag,
  getPlayerInternalData,

  separateString,

  grantItemsToUser,
  changeUserDisplayName,

  getPlayerInventory,
  getFriendsList
}