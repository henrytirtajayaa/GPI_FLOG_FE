export default {
    API: "http://localhost:5000/", ////66.96.238.237:7000  localhost:5000
    DATETIMEFORMAT: 'DD/MM/YYYY HH:mm:ss',
    DATEFORMAT: 'DD/MM/YYYY',
    CACHESINGIN: "SignInUsers",
    CACHEUSERMENU: "NavigationMenu",
    ErrorDescription: {
        validation(value) {
            var rules = []
            if (value.required == true) {
                rules.push(v => !!v || value.name + " is required")
            }
            if (value.maxlength > 0) {
                rules.push(v => v.length <= value.maxlength || value.name + ' must be less than ' + value.maxlength + ' characters')
            }
            if (value.notspecialchar == true) {
                rules.push(v => !!v.match("^([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$") || value.name + 'Cannot contains special charaters')
            }
            if(value.email == true) {
                rules.push(v => /.+@.+\..+/.test(v) || 'E-mail must be valid')
            }
            if(value.minInput != null) {
                var limit = value.minInput - 1
                rules.push(v => v > limit || value.name + ' value must > ' + limit)
            }

            return rules
        }
    },
    FORMAT: {
        formatDate (date) {
            if (!date) return null
    
            const [year, month, day] = date.split('-')
            return day + '-' + month + '-' + year
        },
        formatDate2 (date) {
            if (!date) return null
    
            const [day, month, year] = date.split('-')
            return  year + '-' + month + '-' + day
        }
    }
}