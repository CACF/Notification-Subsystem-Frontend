/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import axios from "axios";
import Base64 from "base-64";
// import FileSaver from "file-saver";
import settings from "./../settings.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";
import i18n from "i18next";
import { ENGLISH_REGEX, SPANISH_REGEX, INDONESIAN_REGEX } from "./constants";

const { defaultLanguage } = settings.appDetails;
const MySwal = withReactContent(Swal);

const {
  host: apiHost,
  port: apiPort,
  version: apiVersion,
  use: apiUse,
} = settings.api;
const {
  host: apimanHost,
  port: apimanPort,
  clientId: apimanClientId,
  use: apimanUse,
} = settings.apiman;
const { appName } = settings.appDetails;

let BASE_URL = "";

if (apiUse) {
  BASE_URL = `${apiHost}${apiPort ? ":" + apiPort : ""}${apiVersion}`;
} else if (apimanUse) {
  BASE_URL = `${apimanHost}${
    apimanPort ? ":" + apimanPort : ""
  }${apimanClientId}`;
}

export const instance = axios.create({
  baseURL: BASE_URL, // QA Build
});

export function getAuthHeader(token) {
  let accessToken = localStorage.getItem("token");
  if (token) {
    accessToken = token;
  }
  return {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
    
  };
}

export function getUserInfo() {
  return JSON.parse(Base64.decode(localStorage.getItem("userInfo")));
}

export function SweetAlert(params) {
  let title = params.title;
  let message = params.message;
  let icon = params.icon;

  MySwal.fire({
    title: <p>{title}</p>,
    icon: icon,
    text: message,
    confirmButtonText: "OK",
  });
}

/**
 * Generic Errors handling for Axios
 *
 * @param context
 * @param error
 */
export function errors(context, error) {
  if (typeof error !== "undefined") {
    if (typeof error.response === "undefined") {
      SweetAlert({
        title: i18n.t("error"),
        icon:"error",
        message: i18n.t("serverNotResponding"),
       
      });
      //toast.error('API Server is not responding or You are having some network issues');
    } else {
      if (error.response.status === 400) {
        if (error.response.data) {
            for (const item in error.response.data) {
              SweetAlert({
                title: "error",
                icon: "error",
                message: error.response.data[item],
               
              });
            }
        } else {
          SweetAlert({
            title: "error",
            icon: "error",
            message: error.response.data,
            
          });
        }

        //toast.error(error.response.data.message);
      } else if (error.response.status === 401) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: i18n.t("sessionExpired"),
        });
        //toast.error('Your session has been expired, please wait');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (error.response.status === 403) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: i18n.t("credentialMatch"),
        });
        //toast.error('These credential do not match our records.');
      } else if (error.response.status === 404) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: error.response.data.Error,
        });
        //toast.error(error.response.data.message);
      } else if (error.response.status === 405) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: i18n.t("wrongHttp"),
        });
        //toast.error('You have used a wrong HTTP verb');
      } else if (error.response.status === 406) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: error.response.data.Error,
        });
        //toast.error(error.response.data.message);
      } else if (error.response.status === 409) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: error.response.data.Error,
        });
        //toast.error(error.response.data.message, { autoClose: 10000 });
      } else if (error.response.status === 422) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message:
            error.response.data.Error === null
              ? i18n.t("unprocessibleEntity")
              : error.response.data.Error,
          
        });
        // let errors = error.response.data.messages;
        // for (var key in errors) {
        //   var caseErrors = errors[key];
        //   for (var i in caseErrors) {

        //     //toast.error(caseErrors[i][0], { autoClose: 10000 });
        //   }
        // }
      } else if (error.response.status >= 500) {
        SweetAlert({
          title: i18n.t("error"),
          icon: "error",
          message: i18n.t("serverNotResponding"),
        });
        //toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
      }
    }
  }
}

/**
 * Media query function for responsive interfaces logic
 * @param maxWidth
 * @param condition1
 * @param condition2
 * @returns {*}
 */
export function matchMedia(maxWidth, condition1, condition2) {
  return window.matchMedia(`(max-width: ${maxWidth}px)`).matches
    ? condition1
    : condition2;
}

/**
 * a function to extract an extension from file
 * @param param
 * @returns {*}
 */
export function getExtension(param) {
  return param.slice((Math.max(0, param.lastIndexOf(".")) || Infinity) + 1);
}

/**
 * this function get all groups of currently loggedIn user
 *
 * @param resources
 * @returns {string}
 */
export function getUserGroups(resources) {
  let groups = "";
  let groupDetails = ((resources || {}).realm_access || {}).roles || [];
  // Remove default group first
  let index = groupDetails.indexOf("uma_authorization");
  if (index !== -1) groupDetails.splice(index, 1);
  if (groupDetails.length > 0) {
    groups = groupDetails;
  }
  return groups;
}

/**
 * This functions get users' groups assigned by Keycloak and see if user has access to this application
 *
 * @param groups
 * @returns {boolean}
 */
export function isPage401(groups) {
  let pageStatus = false; // assume it's not page401
  pageStatus = groups.length > 0 ? false : true; // if groups exist then that's not page401
  if (!pageStatus) {
    // if groups exist then we apply another check
    pageStatus = _isValidAppName(groups) ? false : true; // app name is same as role assigned
  }
  return pageStatus;
}

/**
 *
 *
 * @param groupDetails
 * @returns {*}
 * @private
 */
function _isValidAppName(groupDetails) {
  return groupDetails.find((app) => app.split("_")[0] === appName);
}

/**
 * this function get currently loggedIn user Role
 *
 * @param resources
 * @returns {string}
 */
export function getUserRole(resources) {
  let role = "";
  let roleStatus = false;
  let groupDetails = ((resources || {}).realm_access || {}).roles || [];
  if (groupDetails.length > 0) {
    roleStatus = _isValidAppName(groupDetails) ? true : false;
    role = _isValidAppName(groupDetails);
  }
  if (roleStatus) {
    if (role.split("_")[2]) {
      role = role.split("_")[2];
    }
  }
  return role;
}

/**
 * Get current LoggedIn User Type
 *
 * @param resources
 * @returns {string}
 */
export function getUserType(resources) {
  let type = "";
  let typeStatus = false;
  let groupDetails = ((resources || {}).realm_access || {}).roles || [];
  if (groupDetails.length > 0) {
    typeStatus = _isValidAppName(groupDetails) ? true : false;
    type = _isValidAppName(groupDetails);
  }
  if (typeStatus) {
    if (type.split("_")[1]) {
      type = type.split("_")[1];
    }
  }
  return type;
}

export function languageCheck(text) {
  if (ENGLISH_REGEX.test(text) && defaultLanguage === "en") {
    return true;
  } else if (SPANISH_REGEX.test(text) && defaultLanguage === "es") {
    return true;
  } else return INDONESIAN_REGEX.test(text) && defaultLanguage === "id";
}

// check and update Token
export const updateTokenHOC = (callingFunc, kc, params) => {
  let config = null;
  if (kc.isTokenExpired(0)) {
    kc.updateToken(0)
      .success(() => {
        localStorage.setItem("token", kc.token);
        config = {
          headers: getAuthHeader(kc.token),
        };
        callingFunc(config, params);
      })
      .error(() => kc.logout());
  } else {
    config = {
      headers: getAuthHeader(),
    };
    callingFunc(config, params);
  }
};

export const setParamsForAPI = (toggleChecked, searchQuery) => {
  let postSearchData = "";
  if (toggleChecked === true) {
    console.log("if");
    if (searchQuery.sms_from) {
      postSearchData += "&sms_from=" + searchQuery.sms_from;
    }
    if (searchQuery.imei) {
      postSearchData += "&imei=" + searchQuery.imei;
    }
    if (searchQuery.subsystem) {
      postSearchData += "&subsystem=" + searchQuery.subsystem;
    }
    if (searchQuery.sms_to) {
      postSearchData += "&sms_to=" + searchQuery.sms_to;
    }
    if (searchQuery.operator) {
      postSearchData += "&operator=" + searchQuery.operator;
    }
    if (searchQuery.filename) {
      postSearchData += "&filename=" + searchQuery.filename;
    }
    if (searchQuery.sms_delivered) {
      postSearchData +=
        "&start_date=" +
        searchQuery.sms_delivered.slice(0, 10) +
        "&end_date=" +
        searchQuery.sms_delivered.slice(11, 21);
      console.log(postSearchData);
    }
    if (searchQuery.sms_content) {
      postSearchData += "&sms_content=" + searchQuery.sms_content;
    }
    return postSearchData;
  } else {
    console.log("else");
    if (searchQuery.email_from) {
      postSearchData += "&email_from=" + searchQuery.email_from;
    }
    if (searchQuery.imei) {
      postSearchData += "&imei=" + searchQuery.imei;
    }
    if (searchQuery.subsystem) {
      postSearchData += "&subsystem=" + searchQuery.subsystem;
    }
    if (searchQuery.email_to) {
      postSearchData += "&email_to=" + searchQuery.email_to;
    }
    if (searchQuery.operator) {
      postSearchData += "&operator=" + searchQuery.operator;
    }
    if (searchQuery.filename) {
      postSearchData += "&filename=" + searchQuery.filename;
    }
    if (searchQuery.email_delivered) {
      postSearchData +=
        "&start_date=" +
        searchQuery.email_delivered.slice(0, 10) +
        "&end_date=" +
        searchQuery.email_delivered.slice(11, 21);
    }
    if (searchQuery.email_content) {
      postSearchData += "&email_content=" + searchQuery.email_content;
    }
    if (searchQuery.email_subject) {
      postSearchData += "&email_subject=" + searchQuery.email_subject;
    }
    return postSearchData;
  }
};


export const getSMSCalcluator=(lengthData)=>{
  const SMSCalculator = {
    // Encoding
    encoding: {
      UTF16: [70, 160, 160],
          GSM_7BIT: [160, 160, 160],
          GSM_7BIT_EX: [160, 160, 160],
    },
    
    // Charset
    charset: {
      gsmEscaped: '\\^{}\\\\\\[~\\]|€',
      gsm: '@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà',
    },
  
    // Regular Expression
    regex: function() {
      return {
        gsm: RegExp(`^[${this.charset.gsm}]*$`),
        gsmEscaped: RegExp(`^[\\${this.charset.gsmEscaped}]*$`),
        gsmFull: RegExp(`^[${this.charset.gsm}${this.charset.gsmEscaped}]*$`),
      };
    },
    
    // Method
    detectEncoding: function(text) {
      if (text.match(this.regex().gsm)) {
        return this.encoding.GSM_7BIT;
      } else if (text.match(this.regex().gsmFull)) {
        return this.encoding.GSM_7BIT_EX;
      } else {
        return this.encoding.UTF16;
      }
    },
    getEscapedCharCount: function(text) {
      return [...text].reduce((acc, char) => acc + (char.match(this.regex().gsmEscaped) ? 1 : 0), 0);
    },
    getPartData: function(totalLength, encoding) {
      let maxCharCount = encoding[2];
      let numberOfSMS = Math.ceil(totalLength / maxCharCount);
      let remaining = maxCharCount - (totalLength - (encoding[0] + encoding[1] + (encoding[2] * (numberOfSMS - 3))));
  
      if (totalLength <= encoding[0]) {
        maxCharCount = encoding[0];
        numberOfSMS = 1;
        remaining = maxCharCount - totalLength;
      } else if (totalLength > encoding[0] && totalLength <= (encoding[0] + encoding[1])) {
        maxCharCount = encoding[1];
        numberOfSMS = 2;
        remaining = maxCharCount - (totalLength - encoding[0]);
      }
  
      return {
        maxCharCount,
        numberOfSMS,
        remaining,
        totalLength,
      };
    },
    getCount: function(text) {
      let length = text.length;
      const encoding = this.detectEncoding(text);
      
      if (encoding === this.encoding.GSM_7BIT_EX) {
        length += this.getEscapedCharCount(text);
      }
  
      return this.getPartData(length, encoding);
    },
  };
  
  
      
  const calculate = () => {
    const count = SMSCalculator.getCount(lengthData);
    
    lengthData = `${count.remaining} / ${count.numberOfSMS}`;

    return lengthData  
};
  
   return calculate()
   
}  
