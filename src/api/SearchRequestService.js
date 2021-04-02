import {instance} from './../utilities/helpers'
//Get SMS
export const getSMSAPI= (config, offset, limit, search) => {
    let searchQ = '';
    searchQ=`/search-sms/?limit=${limit}&offset=${offset}${search}`
    return instance
     .get(searchQ,config)
}

//Get Email
export const getEmailAPI= (config, offset, limit, search) => {
    let searchQ = '';
    searchQ=`/search-email/?limit=${limit}&offset=${offset}${search}`
    return instance
     .get(searchQ,config)
}
