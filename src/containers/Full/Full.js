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
import React, {Component} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import { Helmet } from "react-helmet";
import Header from "./../../components/Header/";
import Sidebar from "./../../components/Sidebar/";
import Breadcrumb from "./../../components/Breadcrumb/";
import Footer from "./../../components/Footer/";
import Page401 from "./../../views/Errors/Page401";
import { withTranslation, Translation } from "react-i18next";
import { ADMIN } from "./../../utilities/constants";
import { getUserType } from "./../../utilities/helpers";
import { Provider } from "react-redux";
import store from "./../../store";
import Dashboard from "../../views/Dashboard/Dashboard";
import CreateNotification from "../../views/CreateNotification/CreateNotification";
import WorkersDetails from "../../views/CampaignStatus/CampaignStatus";
import SearchRequests from "../../views/SearchRequests/SearchRequests";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setKC,
  setUserDetails,
  setResources,
} from "./../../actions/authActions";
class Full extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: 'en'
    }
    this.changeLanguage = this.changeLanguage.bind(this);
    
  }

  componentDidMount() {
    store.dispatch(setKC(this.props.kc))
    store.dispatch(setUserDetails(this.props.userDetails))
    store.dispatch(setResources(this.props.resources))
    this.setState({
      lang: localStorage.getItem('i18nextLng')
    })
  }

  changeLanguage(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    this.setState({
      lang: lng
    })
  }
  render() { 
    return (
      <Translation ns="translations">
        {(t, { i18n }) => (
          <div className="app">
            <Helmet>
              <html lang={this.state.lang} />
              <title>{i18n.t("title")}</title>
              <body dir={this.state.lang === "ar" ? "rtl" : "ltr"} />
            </Helmet>
            <Header {...this.props} switchLanguage={this.changeLanguage} />
            <div className="app-body">
              <Sidebar {...this.props} />
              <main className="main">
                <Breadcrumb {...this.props} />
                <Container fluid>
                <ToastContainer
                    position="bottom-right"
                    style={{ width: "400px" }}
                  />
                  <Provider store={store}>
                    <Switch>
                    {getUserType(this.props.resources) === ADMIN && (
                        <Route
                        path="/dashboard/:id"
                          name="CampaignStatusLink"
                          render={(props) => <WorkersDetails {...this.props} {...props}  />}
                          />
                          )}

                      {getUserType(this.props.resources) === ADMIN && (
                        <Route
                        path="/dashboard"
                          name="dashboard"
                          render={(props) => <Dashboard {...this.props} {...props}  />}
                          />
                          )}
                     
                      {getUserType(this.props.resources) === ADMIN && (
                        <Route
                        path="/create-notification"
                          name="CreateNotificationLink"
                          render={(props) => <CreateNotification {...this.props} {...props}  />}
                          />
                          )}
                      {},
                        {getUserType(this.props.resources) === ADMIN && (
                          <Route
                          path="/search-requests"
                          name="SearchRequestsLink"
                          render={(props) => <SearchRequests {...this.props} {...props} />}
                          />
                          )}
                      <Redirect from="/" to="/dashboard"/>
                      
                      <Route
                        path="/unauthorized-access"
                        name="Page401"
                        component={Page401}
                      />
                    </Switch>
                  </Provider>
                </Container>
              </main>
            </div>
            <Footer />
          </div>
        )}
      </Translation>
    ); 
  }
}
 
export default withTranslation("translations")(Full);
