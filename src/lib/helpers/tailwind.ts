import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'
const fullConfig = resolveConfig(tailwindConfig)

export const tw = (): Record<string, any> => {
    return fullConfig
}
