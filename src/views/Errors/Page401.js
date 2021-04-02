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

import React, { useEffect } from 'react';
import Header from '../../components/Header/';
import Footer from '../../components/Footer/';
import i18n from 'i18next'
import settings from './../../settings';

/**
 * This component generates 401 page for unauthorized user. i.e. Keycloak user who doesn't have access to this system.
 * Also it provides user with contact details.
 */
const Page401 = (props) => {
    useEffect(() => {
        document.body.classList.remove('sidebar-fixed');
        document.body.classList.remove('aside-menu-fixed');
        document.body.classList.remove('aside-menu-hidden');
        props.history.push('/unauthorized-access');
       
    }, [props.history])
    const changeLanguage=(lng)=> {
        const { i18n } = props;
        i18n.changeLanguage(lng);
    }
    const {supportEmail, supportNumber} = settings.appDetails;
    return (   <div className="app header-fixed">
    <Header {...props} switchLanguage={changeLanguage} />
    <div className="app-body">
        <main className="main p401">
            <div className="container-fluid">
                <div className="text-center">
                    <h1><b>401</b></h1>
                    <h2>{i18n.t("unauthorizedpage")}</h2>
                    <h6><b>{i18n.t("contactadministrator")}</b></h6>
                    <div className="inline-support">
                        <ul>
                            <li><b>{i18n.t("email")}:&nbsp;&nbsp;</b>{supportEmail}</li>
                        </ul>
                        <ul>
                            <li><b>{i18n.t("phone")}:&nbsp;&nbsp;</b>{supportNumber}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <Footer />
</div> );
}
 
export default Page401;

