import React from 'react';
import SearchRequests from './SearchRequests';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../i18nTest";
import sinon from 'sinon';
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';
import {DEVICE_TYPES, STATUS_TYPES, TECHNOLOGIES} from '../../utilities/constants'

STATUS_TYPES.push(
  {"id": 1, "description": "New Request"},
  {"id": 2, "description": "Awaiting Documents"},
  {"id": 3, "description": "Pending Review"},
  {"id": 4, "description": "In Review"},
  {"id": 5, "description": "Information Requested"},
  {"id": 6, "description": "Approved"},
  {"id": 7, "description": "Rejected"}, {"id": 8, "description": "Closed"},
  {"id": 9, "description": "Failed"},
  {"id": 10, "description": "Processed"}, {"id": 11, "description": "Processing"}
)
DEVICE_TYPES.push(
  {"id": 1, "description": "Smartphone"},
  {"id": 2, "description": "Tablet"},
  {"id": 3, "description": "Feature phone"},
  {"id": 4, "description": "Computer"},
  {"id": 5, "description": "Dongle"},
  {"id": 6, "description": "Router"},
  {"id": 7, "description": "Vehicle"},
  {"id": 8, "description": "Other"}
)
TECHNOLOGIES.push(
  {"id": 1, "description": "2G"},
  {"id": 2, "description": "3G"},
  {"id": 3, "description": "4G"},
  {"id": 4,"description": "5G"})
/**/
Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    }
  })
});

const mockKcProps = {
  'isTokenExpired': sinon.spy()
}

const kcResource = {
  realm_access: {
    roles: ['uma_authorization', 'drs_authority']
  }
}
const resourceMock = {
  realm_access: {
    roles: ['drs_authority']
  }
}
let responseObj = {
  data: {
    requests: [
      {
        processing_status_label: 11,
        report_status_label: 9,
        status: 'New Request',
        request_type: 1,
        id: 1,
        tracking_id: 'test-tracking-id',
        reviewer: {
          user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
          user_name: 'test-user'
        },
        device_details: {
          device_count: 1,
        },
        created_at: '2018-01-01 10:10:10',
        updated_at: '2018-01-01 10:10:10'
      }
    ],
    count: 1,
    limit: 10,
    start: 1
  }
}

const mockLocationProp = {
  state: null
}

const mockHeader = {
  "headers": {
    "Accept-Language": "en",
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

describe('Search component', () => {
  beforeEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
    localStorage.clear();
    localStorage.userInfo = 'eyJzdWIiOiI4MWU1M2Q3YS00NDgzLTQwN2MtYjlmNy0xZWJkOWZlMDVhYzYiLCJuYW1lIjoiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHJzIGF1dGggdXNlciJ9';
  });
  /*test("if renders correctly", () => {
    const wrapper = shallow(<SearchRequests kc={mockKcProps} location={mockLocationProp}/>);
    expect(wrapper).toMatchSnapshot()
  });*/
  test('If SearchCases renders',()=>{
    const wrapper = shallow(<SearchRequests kc={mockKcProps} location={mockLocationProp}/>);
    expect(wrapper.exists()).toBe(true);
  })
  test('SearchCases if renders no li elements would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests kc={mockKcProps} location={mockLocationProp}/>
      </I18nextProvider>
    );
    expect(wrapper.find('li')).toHaveLength(0);
  })

  test('SearchCases have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests kc={mockKcProps} location={mockLocationProp}/>
      </I18nextProvider>
    );
    const PAGE_LIMIT = 10;
    expect(wrapper.find('SearchRequests').state().showAllFilters).toBe(false)
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(false)
    expect(wrapper.find('SearchRequests').state().loading).toBe(false)
    expect(wrapper.find('SearchRequests').state().totalCases).toBe(0)
    expect(wrapper.find('SearchRequests').state().limit).toBe(PAGE_LIMIT)
    expect(wrapper.find('SearchRequests').state().searchQuery).toEqual({})
  })

  test('showAllFilters button toggling works', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests kc={mockKcProps} location={mockLocationProp}/>
      </I18nextProvider>
    );
    const button = wrapper.find('Button').at(0).find('button');
    button.simulate('click')
    expect(wrapper.find('SearchRequests').state().showAllFilters).toBe(true);
    button.simulate('click')
    expect(wrapper.find('SearchRequests').state().showAllFilters).toBe(false);
  })

  test('Clear search button click works', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SearchRequests kc={mockKcProps} location={mockLocationProp}/>
        </Router>
      </I18nextProvider>
    );
    wrapper.find('input').at(2).simulate('change', {
      target: {
        value: '2018-12-05',
        name: 'your_unique_start_date_id'
      }
    });
    wrapper.find('input').at(3).simulate('change', {
      target: {
        value: '2018-12-15',
        name: 'your_unique_end_date_id'
      }
    });
    wrapper.update();
    // console.log(wrapper.find('form').debug())
    let button = wrapper.find('Button').at(1).find('button');
    expect(button.props().disabled).toBe(false);
    wrapper.find('form').simulate('submit');
    let responseObj = {
      data: {
        "start": 1,
        "count": 3,
        "limit": 10,
        "previous": "",
        "requests": [
          {
          "status": "In Review",
          "request_type": 1,
          "updated_at": "2019-01-17 07:34:03",
          "created_at": "2019-01-02 11:41:58",
          "id": 43123,
          "report": "compliant_report62f00f7e-ba8f-46d7-9269-fc1d0e2b4517.tsv",
          "processing_status_label": 10,
          "tracking_id": "b40cff8d-411b-42f4-823a-92ce9f4d4fe8",
          "report_status_label": 10,
          "device_details": {
            "imeis": ["1111111111111111"],
            "technologies": "2G, 3G, 4G",
            "model_name": "Galaxy J6 (J600F/DS)",
            "device_type": "Smartphone",
            "operating_system": "Android",
            "brand": "Samsung",
            "device_count": "1"
          },
          "creator": {"user_id": "6ed9747b-d36a-4799-88c8-59d17a9abb5a", "user_name": "drs importer user"},
          "reviewer": {"user_id": "0f3cb9e0-b13c-46f3-9a14-4defaa48afd2", "user_name": "auto reviewer"}
        },
          {
          "status": "Awaiting Documents",
          "request_type": 1,
          "updated_at": "2019-01-03 10:37:20",
          "created_at": "2019-01-03 10:36:48",
          "id": 43148,
          "report": "compliant_report76dd0681-39ab-4c66-b6e9-f9305323210c.tsv",
          "processing_status_label": 10,
          "tracking_id": "db744c05-7154-4fb6-a55c-7fa1bdd74a1d",
          "report_status_label": 10,
          "device_details": {
            "imeis": ["1111111111111111"],
            "technologies": "2G, 3G, 4G",
            "model_name": "t",
            "device_type": "Smartphone",
            "operating_system": "t",
            "brand": "t",
            "device_count": "1"
          },
          "creator": {"user_id": "6ed9747b-d36a-4799-88c8-59d17a9abb5a", "user_name": "drs importer user"},
          "reviewer": {"user_id": "N/A", "user_name": "N/A"}
        },
          {
          "status": "Awaiting Documents",
          "request_type": 1,
          "updated_at": "2019-01-03 10:29:26",
          "created_at": "2019-01-03 10:27:55",
          "id": 43147,
          "report": "compliant_report984fa9a0-9ed1-4083-81d7-a7e651f9fb1e.tsv",
          "processing_status_label": 10,
          "tracking_id": "eef8f6ee-b294-47b6-bc16-1e503dad3cee",
          "report_status_label": 10,
          "device_details": {
            "imeis": ["1111111111111111"],
            "technologies": "2G, 3G, 4G",
            "model_name": "t",
            "device_type": "Smartphone",
            "operating_system": "t",
            "brand": "t",
            "device_count": "1"
          },
          "creator": {"user_id": "6ed9747b-d36a-4799-88c8-59d17a9abb5a", "user_name": "drs importer user"},
          "reviewer": {"user_id": "N/A", "user_name": "N/A"}
        }],
        "next": ""
      },
      status:200
    }
    mockAxios.mockResponse(responseObj)
    wrapper.update();
    //Click clear all
    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.find('Formik').state().values.created_at).toEqual('');
    expect(wrapper.find('Formik').state().values.updated_at).toEqual('');
  })

  test('when submit button is clicked', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests kc={mockKcProps} location={mockLocationProp}/>
      </I18nextProvider>
    );
    const form = wrapper.find('form')
    form.simulate('submit')
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(true);
  })

  test("if submit button clicked then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    const form = wrapper.find('form');
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 11,
            report_status_label: 9,
            status: 'New Request',
            request_type: 1,
            id: 1,
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
              user_name: 'test-user'
            },
            device_details: {
              device_count: 1,
            },
            created_at: '2018-01-01 10:10:10',
            updated_at: '2018-01-01 10:10:10'
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }

    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {
        "group": "reviewer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    expect(wrapper.find('.listbox .text-primary').text()).toEqual('1 Request found');
    const table = wrapper.find('table');
    expect(table.exists()).toEqual(true);
    expect(wrapper.find('SearchRequests').find('.listbox table tr')).toHaveLength(2);
    // Do this for all other Heading fields
    expect(table.at(0).find('th').at(0).text()).toEqual('Request ID');
    expect(table.at(0).find('th').at(1).text()).toEqual('Request type');
    // Do this for all other Data fields
    expect(table.at(0).find('td').at(0).text()).toEqual('Failed');
    expect(table.at(0).find('td').at(1).text()).toEqual("1");
  });

  test("provide ID and Status Inputs and submit search form", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    wrapper.find('input').at(0).simulate('change', {
      target: {
        value: "1",
        name: 'id'
      }
    });
    wrapper.find('select').at(0).simulate('change', {
      target: {
        value: "Pending Review",
        name: 'status'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    // Update Status
    responseObj.data.requests[0].status = 'Pending Review';
    responseObj.data.requests[0].processing_status_label = 12;
    responseObj.data.requests[0].report_status_label = 12;
    // simulating a server response
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
        id: "1",
        status: "Pending Review"
      },
      "search_specs": {
        "group": "reviewer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('td').at(0).text()).toEqual('Pending Review');
  });

  test("provide Request Type input and submit search form", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    wrapper.find('select').at(1).simulate('change', {
      target: {
        value: 2,
        name: 'request_type'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    // Update Status
    responseObj.data.requests[0].status = 'Pending Review';
    responseObj.data.requests[0].request_type = 2;
    // simulating a server response
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
      },
      "search_specs": {
        "group": "reviewer",
        "request_type": 2,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('td').at(2).text()).toEqual('De-registration');
  });

  test("provide Created and Updated Date inputs and submit search form", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )
    // Populate Created_at Start and End Date
    wrapper.find('input').at(2).simulate('change', {
      target: {
        value: '2018-12-05',
        name: 'your_unique_start_date_id'
      }
    });
    wrapper.find('input').at(3).simulate('change', {
      target: {
        value: '2018-12-15',
        name: 'your_unique_end_date_id'
      }
    });
    // Populate Updated_at Start and End Date
    wrapper.find('input').at(4).simulate('change', {
      target: {
        value: '2018-12-01',
        name: 'your_unique_start_date_id'
      }
    });
    wrapper.find('input').at(5).simulate('change', {
      target: {
        value: '2018-12-10',
        name: 'your_unique_end_date_id'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    // Update Status
    responseObj.data.requests[0].status = 'Pending Review';
    responseObj.data.requests[0].request_type = 1;
    responseObj.data.requests[0].processing_status_label = 1;
    responseObj.data.requests[0].report_status_label = 1;
    // simulating a server response
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
        "created_at": "2018-12-05,2018-12-15",
        "updated_at": "2018-12-01,2018-12-10",
      },
      "search_specs": {
        "group": "reviewer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('td').at(4).text()).toEqual('10:10 01/01/2018');
    expect(table.at(0).find('td').at(5).text()).toEqual('10:10 01/01/2018');
  });

  test("provide other form inputs and submit search form", () => {
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 1,
            report_status_label: 1,
            status: 'Pending Review',
            request_type: 1,
            id: 1,
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
              user_name: 'test-user'
            },
            device_details: {
              brand: 'samsung',
              model_name: 'test model',
              model_num: 'test number',
              device_type: 'Smartphone',
              operating_system: 'android',
            },
            device_count: 1,
            imei_per_device: 1,
            m_location: 'local'
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )
    wrapper.find('input').at(6).simulate('change', {
      target: {
        value: 'samsung',
        name: 'brand'
      }
    });
    wrapper.find('input').at(7).simulate('change', {
      target: {
        value: 'test model',
        name: 'model_name'
      }
    });
    wrapper.find('input').at(8).simulate('change', {
      target: {
        value: 'test number',
        name: 'model_num'
      }
    });
    wrapper.find('select').at(2).simulate('change', {
      target: {
        value: 'Smartphone',
        name: 'device_type'
      }
    });
    wrapper.find('input').at(9).simulate('change', {
      target: {
        value: 'android',
        name: 'operating_system'
      }
    });
    
    wrapper.find('input').at(11).simulate('change', {
      target: {
        value: 1,
        name: 'device_count'
      }
    });
    wrapper.find('input').at(12).simulate('change', {
      target: {
        value: 1,
        name: 'imei_per_device'
      }
    });
    wrapper.find('select').at(3).simulate('change', {
      target: {
        value: 'local',
        name: 'm_location'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    // simulating a server response
    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
        "brand": "samsung",
        "model_name": "test model",
        "model_num": "test number",
        "device_type": "Smartphone",
        "operating_system": "android",
        "device_count": 1,
        "imei_per_device": 1,
        "m_location": "local"
      },
      "search_specs": {
        "group": "reviewer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    expect(wrapper.find('Formik').state().values.brand).toEqual('samsung');
    expect(wrapper.find('Formik').state().values.model_name).toEqual('test model');
    expect(wrapper.find('Formik').state().values.model_num).toEqual('test number');
    expect(wrapper.find('Formik').state().values.device_type).toEqual('Smartphone');
    expect(wrapper.find('Formik').state().values.operating_system).toEqual('android');
    expect(wrapper.find('Formik').state().values.device_count).toEqual(1);
    expect(wrapper.find('Formik').state().values.imei_per_device).toEqual(1);
    expect(wrapper.find('Formik').state().values.m_location).toEqual('local');
  });

  test("Invalid values of device count and imei per device inputs", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    );
    wrapper.find('input').at(11).simulate('change', {
      target: {
        value: 'test',
        name: 'device_count'
      }
    });
    wrapper.find('input').at(12).simulate('change', {
      target: {
        value: 'test',
        name: 'imei_per_device'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    expect(wrapper.find('Formik').state().errors.device_count).toEqual('Must be a number');
    expect(wrapper.find('Formik').state().errors.imei_per_device).toEqual('Must be a number');
    wrapper.find('input').at(11).simulate('change', {
      target: {
        value: 100000001,
        name: 'device_count'
      }
    });
    wrapper.find('input').at(12).simulate('change', {
      target: {
        value: 6,
        name: 'imei_per_device'
      }
    });
    form.simulate('submit')
    expect(wrapper.find('Formik').state().errors.device_count).toEqual('Must be in between 1-1,000,000');
    expect(wrapper.find('Formik').state().errors.imei_per_device).toEqual('Must be in between 1-5');
  });

  test("if user is importer then submit search form", () => {
    // if user is importer
    kcResource.realm_access.roles[1] = 'drs_importer'
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    const form = wrapper.find('form')
    form.simulate('submit')

    // Update Status
    responseObj.data.requests[0].status = 'New Request';
    responseObj.data.requests[0].request_type = 1;
    responseObj.data.requests[0].processing_status_label = 11;
    responseObj.data.requests[0].report_status_label = 11;
    // simulating a server response
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {
        "group": "importer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
  });

  test("When request status is Information Requested then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    const form = wrapper.find('form')
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 1,
            report_status_label: 1,
            status: 'Information Requested',
            request_type: 1,
            id: 1,
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
              user_name: 'test-user'
            },
            device_details: {
              device_count: 1,
            },
            created_at: '2018-01-01 10:10:10',
            updated_at: '2018-01-01 10:10:10'
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {
        "group": "importer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('tbody tr td').at(6).find('span').text()).toEqual('Incomplete');
    expect(table.at(0).find('tbody tr td').at(7).find('button').text()).toEqual('Close');
    table.at(0).find('tbody tr td').at(7).find('button').simulate('click');
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(true);
  });

  test("When request status is Pending Review then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    const form = wrapper.find('form')
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 1,
            report_status_label: 1,
            status: 'Pending Review',
            request_type: 1,
            id: 1,
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
              user_name: 'test-user'
            },
            device_details: {
              device_count: 1,
            },
            created_at: '2018-01-01 10:10:10',
            updated_at: '2018-01-01 10:10:10'
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {
        "group": "importer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('tbody tr td').at(6).find('span').text()).toEqual('Incomplete');
    expect(table.at(0).find('tbody tr td').at(7).find('button').text()).toEqual('Close');
    table.at(0).find('tbody tr td').at(7).find('button').simulate('click');
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(true);
  });

  test("Registration request Close button click and reinitiate button click", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    const form = wrapper.find('form')
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 1,
            report_status_label: 1,
            status: 'Information Requested',
            request_type: 1,
            id: 1,
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
              user_name: 'test-user'
            },
            device_details: {
              device_count: 1,
            },
            created_at: '2018-01-01 10:10:10',
            updated_at: '2018-01-01 10:10:10'
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('tbody tr td').at(6).find('span').text()).toEqual('Incomplete');
    expect(table.at(0).find('tbody tr td').at(7).find('button').text()).toEqual('Close');
    table.at(0).find('tbody tr td').at(7).find('button').simulate('click');
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(true);
  });

  test("Deregistration request Close button click and reinitiate button click", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    );
    wrapper.find('select').at(1).simulate('change', {
      target: {
        value: 2,
        name: 'request_type'
      }
    });
    const form = wrapper.find('form')
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        requests: [
          {
            processing_status_label: 10,
            updated_at: '2018-12-27 07:56:08',
            report: "compliant_report8a054506-1ddc-4db8-92b6-ec8e607dd9fa.tsv",
            id: 1,
            status: 'Information Requested',
            report_status_label: 10,
            created_at: '2018-12-20 05:33:58',
            tracking_id: 'test-tracking-id',
            reviewer: {
              user_id: '3341',
              user_name: 'test-user'
            },
            device_details: {
              model_name: 'E440i',
              m_location: 'N/A',
              operating_system: 'N/A',
              technologies: 'NONE',
              imeis: ['35643807744165', '35643807744167'],
              device_count: 1,
              model_num: 'E440i',
              device_type: 'Mobile Phone/Feature Phone',
              brand: 'Sony'
            },
            request_type: 2,
            creator: {
              user_name: 'exporter',
              user_id: '3c05fa5c-4106-4cd9-8a74-3552bff9c824'
            }
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    }

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    const table = wrapper.find('table');
    expect(table.at(0).find('tbody tr td').at(6).find('span').text()).toEqual('Information requested');
    expect(table.at(0).find('tbody tr td').at(7).find('button').text()).toEqual('Close');
    table.at(0).find('tbody tr td').at(7).find('button').simulate('click');
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(true);
  });

  //Search Filters
  test('if search filters added on search',()=>{
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={kcResource}/>
        </I18nextProvider>
      </Router>
    )

    //Setting search
    wrapper.find('Formik').setState({
      values : {
        brand:"Samsung",
        created_at:"2019-01-01,2019-01-03",
        device_count:3,
        device_type:"Tablet",
        id:"8819",
        imei_per_device:1,
        m_location:"local",
        model_name:"Iam model",
        model_num:"30jjd",
        operating_system:"Android",
        request_type:"2",
        status:"Pending Review",
        technologies:[
          {
            label:"3G",
            value:"3G"
          },
          {
            label:"4G",
            value:"4G"
          },
        ],
        updated_at:"2019-01-01,2019-01-03",
        imeis : [
          {
            className:"Select-create-option-placeholder",
            label:"12345",
            value:"12345"
          },
          {
            className:"Select-create-option-placeholder",
            label:"123456",
            value:"123456"
          }
        ]
      }
    })
    //Submitting search
    const form = wrapper.find('form');
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        next: "/search?start=11&limit=10",
        previous: "",
        limit: 10,
        start: 1,
        count: 2701,
        requests: [
          {
            created_at: "2019-01-09 12:51:10",
            creator: {user_name: "auto exporter", user_id: "3c05fa5c-4106-4cd9-8a74-3552bff9c824"},
            device_details: {},
            id: 4407,
            processing_status_label: 10,
            report: "compliant_reportbc42707a-a812-4117-bf25-572994e5e47a.tsv",
            report_status_label: 10,
            request_type: 2,
            reviewer: {user_name: "auto reviewer", user_id: "0f3cb9e0-b13c-46f3-9a14-4defaa48afd2"},
            status: "Approved",
            tracking_id: "bf9b5fc6-33f7-4c30-aabf-5eb884d2a982",
            updated_at: "2019-01-09 12:52:53"
          }
        ]
      },
      status:200
    }

    mockAxios.mockResponse(responseObj)
    wrapper.update()

    //Tests
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
        "brand": "Samsung",
        "created_at": "2019-01-01,2019-01-03",
        "device_count": 3,
        "device_type": "Tablet",
        "id": "8819",
        "imei_per_device": 1,
        "imeis": [
          "12345","123456"
        ],
        "m_location": "local",
        "model_name": "Iam model",
        "model_num": "30jjd",
        "operating_system": "Android",
        "status": "Pending Review",
        "technologies": [
          "3G","4G"
        ],
        "updated_at": "2019-01-01,2019-01-03",
      },
      "search_specs": {
        "group": "importer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().currSearchQuery.length).toEqual(16)

    //Delete filter
    let deleteFilterBtn = wrapper.find('SearchFilters').find('li').at(0).find('p')
    //ID
    deleteFilterBtn.simulate('click')
    //Request Status
    deleteFilterBtn.simulate('click')
    //Created date
    deleteFilterBtn.simulate('click')
    //Date last updated
    deleteFilterBtn.simulate('click')
    //Brand
    deleteFilterBtn.simulate('click')
    //Model name
    deleteFilterBtn.simulate('click')
    //Model number
    deleteFilterBtn.simulate('click')
    //Device type
    deleteFilterBtn.simulate('click')
    //Operating system
    deleteFilterBtn.simulate('click')
    //Technologies
    deleteFilterBtn.simulate('click')
    //Technologies
    deleteFilterBtn.simulate('click')
    //device_count
    deleteFilterBtn.simulate('click')
    //Number of IMEIs per device
    deleteFilterBtn.simulate('click')
    //Device IMEIs
    deleteFilterBtn.simulate('click')
    //Device IMEIs
    deleteFilterBtn.simulate('click')
    //Manufacturing location
    deleteFilterBtn.simulate('click')

    //Search
    wrapper.find('form').simulate('submit')
    //API call
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    //Test
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
      },
      "search_specs": {
        "group": "importer",
        "request_type": 1,
        "user_id": "",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().currSearchQuery.length).toEqual(0)

  })

  test('If reInitiate Request works correctly for registration',()=>{
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={resourceMock}/>
        </I18nextProvider>
      </Router>
    )
    //Setting request type deRegistration
    wrapper.find('select').at(1).simulate('change',{
      target: {
        name: 'request_type',
        value: '2'
      }
    })
    //Submitting search
    const form = wrapper.find('form');
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        next: "/search?start=11&limit=10",
        previous: "",
        limit: 10,
        start: 1,
        count: 2701,
        requests: [
          {
            created_at: "2019-01-09 12:51:10",
            creator: {user_name: "auto exporter", user_id: "3c05fa5c-4106-4cd9-8a74-3552bff9c824"},
            device_details: {},
            id: 4407,
            processing_status_label: 11,
            report: "compliant_reportbc42707a-a812-4117-bf25-572994e5e47a.tsv",
            report_status_label: 9,
            request_type: 2,
            reviewer: {
              user_id: "81e53d7a-4483-407c-b9f7-1ebd9fe05ac6",
              user_name: "drs auth user"
            },
            status: "In Review",
            tracking_id: "bf9b5fc6-33f7-4c30-aabf-5eb884d2a982",
            updated_at: "2019-01-09 12:52:53"
          }
        ]
      },
      status:200
    }

    mockAxios.mockResponse(responseObj)
    wrapper.update()

    //Test
    wrapper.find('table').find('td').last().childAt(0).simulate('click')
    //Mock API call
    let restartResponse = {
      data: {},
      status:200
    }
    mockAxios.mockResponse(restartResponse)

    mockAxios.mockResponse(responseObj)
    wrapper.update()
    //After restart search request has been called
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {"group": "reviewer", "request_type": 2, "user_id": ""},
      "start": 1
    }, mockHeader)
  })

  test('If reInitiate Request works correctly for De-registration',()=>{
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={mockLocationProp} resources={resourceMock}/>
        </I18nextProvider>
      </Router>
    )
    //Setting request type deRegistration
    wrapper.find('select').at(1).simulate('change',{
      target: {
        name: 'request_type',
        value: '1'
      }
    })
    //Submitting search
    const form = wrapper.find('form');
    form.simulate('submit')
    // simulating a server response
    let responseObj = {
      data: {
        next: "/search?start=11&limit=10",
        previous: "",
        limit: 10,
        start: 1,
        count: 2701,
        requests: [
          {
            created_at: "2019-01-09 12:51:10",
            creator: {user_name: "auto exporter", user_id: "3c05fa5c-4106-4cd9-8a74-3552bff9c824"},
            device_details: {},
            id: 4407,
            processing_status_label: 11,
            report: "compliant_reportbc42707a-a812-4117-bf25-572994e5e47a.tsv",
            report_status_label: 9,
            request_type: 1,
            reviewer: {
              user_id: "81e53d7a-4483-407c-b9f7-1ebd9fe05ac6",
              user_name: "drs auth user"
            },
            status: "In Review",
            tracking_id: "bf9b5fc6-33f7-4c30-aabf-5eb884d2a982",
            updated_at: "2019-01-09 12:52:53"
          }
        ]
      },
      status:200
    }

    mockAxios.mockResponse(responseObj)
    wrapper.update()

    //Test
    wrapper.find('table').find('td').last().childAt(0).simulate('click')
    //Mock API call
    let restartResponse = {
      data: {},
      status:200
    }
    mockAxios.mockResponse(restartResponse)

    mockAxios.mockResponse(responseObj)
    wrapper.update()
    //After restart search request has been called
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "search_specs": {"group": "reviewer", "request_type": 1, "user_id": ""},
      "start": 1
    }, mockHeader)
  })

  //Pre defined search from Dashboard
  describe('Pre defined search filters',()=>{
    beforeEach(() => {
      // cleaning up the mess left behind the previous test
      mockAxios.reset();
    });
    test('If Pending Review Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'pending registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Pending Review')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(1)
    })
    test('If Pending Review De-Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'pending de-registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Pending Review')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(2)
    })
    test('If In Review Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'in review registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('In Review')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(1)
    })
    test('If In Review De-Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'in review de-registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('In Review')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(2)
    })
    test('If Awaiting documents Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'awaiting registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Awaiting Documents')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(1)
    })
    test('If Awaiting documents De-Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'awaiting de-registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Awaiting Documents')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(2)
    })
    test('If Awaiting documents Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'information requested registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Information Requested')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(1)
    })
    test('If Awaiting documents De-Registration is predefined filter', () => {
      let locationProps = {
        state: {
          filter : 'information requested de-registrations'
        }
      }
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} location={locationProps}/>
        </I18nextProvider>
      );

      //Test
      expect(wrapper.find('SearchRequests').state().searchQuery.status).toEqual('Information Requested')
      expect(wrapper.find('SearchRequests').state().requestType).toEqual(2)
    })
  })
});
