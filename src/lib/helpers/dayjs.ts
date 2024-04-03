import dayjs from "dayjs";
import 'dayjs/locale/nb'
import 'dayjs/locale/sv'
import 'dayjs/locale/fi'

dayjs.locale('nb')

const getLocale = (country: string) => {
    const c = country.toLowerCase()
    if (c === 'no') {
        return 'nb'
    }

    return c
}

export {
    dayjs,
    getLocale
}
