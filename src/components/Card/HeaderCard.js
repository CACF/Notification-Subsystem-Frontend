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
import React from "react";
import { Card, CardHeader, Col } from "reactstrap";
const HeaderCard = ({ headerData, titleText, bgColor }) => {
  const style = {
    fontSize: "14px",
    display: "block",
    fontFamily: "Aileron",
    textAlign: "center",
    color: "white",
    fontWeight: "450",
  };
  return (
    <Col xl={3} lg={3} md={4} sm={6}>
      <Card style={{ backgroundColor: bgColor }}>
        <CardHeader
          style={{
            height: "18vh",
            padding: "15px",
            textAlign: "center",
            outline: "none",
          }}
        >
          <b className="text text-white"> {titleText && titleText} </b>
          {Object.keys(headerData).includes("duplication_list_Stats") &&
            Object.keys(headerData).map((data) =>
              Object.keys(headerData[data]).map(
                (item) =>
                  (item === "total_imeis" && (
                    <span key={item} style={style}>
                      Total IMEIS : {headerData[data][item]}
                    </span>
                  )) ||
                  (item === "pending_imeis" && (
                    <span key={item} style={style}>
                      Pending IMEIS : {headerData[data][item]}
                    </span>
                  ))
              )
            )}
          {Object.keys(headerData).includes("user_summary") &&
            Object.keys(headerData).map((data) =>
              Object.keys(headerData[data]).map(
                (item) =>
                  (item === "pending_imeis" && (
                    <span key={item} style={style}>
                      Total IMEIS : {headerData[data][item]}
                    </span>
                  )) ||
                  (item === "responded_imeis" && (
                    <span key={item} style={style}>
                      Pending IMEIS : {headerData[data][item]}
                    </span>
                  ))
              )
            )}
          {Object.keys(headerData).includes(
            "gsma_brands_detail" || "oem_logins_detail"
          ) &&
            Object.keys(headerData).map((data) =>
              Object.keys(headerData[data]).map(
                (item) =>
                  (item === "total_oems" && (
                    <span key={item} style={style}>
                      Total OEMS : {headerData[data][item]}
                    </span>
                  )) ||
                  (item === "approved_oems" && (
                    <span key={item} style={style}>
                      Approved OEMS : {headerData[data][item]}
                    </span>
                  )) ||
                  (item === "pending_oems" && (
                    <span key={item} style={style}>
                      Pending OEMS : {headerData[data][item]}
                    </span>
                  ))
              )
            )}
          {Array.isArray(headerData) && headerData && (
            <span style={style}>
              No of OEM
              <span
                style={{
                  fontSize: "20px",
                  textAlign: "center",
                  display: "block",
                }}
              >
                {headerData.length}
              </span>
            </span>
          )}
        </CardHeader>
      </Card>
    </Col>
  );
};

export default HeaderCard;
