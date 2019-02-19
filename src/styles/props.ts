import { css } from 'styled-components'

export const prop = (name: string, ...options: any[]) => {
  let styleProperties = [name]
  if (typeof options[0] === 'string') {
    styleProperties = [options.shift()]
  } else if (Array.isArray(options[0])) {
    styleProperties = options.shift()
  }

  let firstOption: any = options[0] || {}

  return (props: any) => {
    let value = props[name]
    if (value === undefined) {
      if (firstOption.default === undefined) return
      value = firstOption.default
    } else {
      if (firstOption.presets && firstOption.presets[value] !== undefined) {
        value = firstOption.presets[value]
      }
    }

    let result = styleProperties.map(property => `${property}: ${value} !important;`)
    return result.join(';\n')
  }
}

export const hasProp = (name: string) => {
  return (template: TemplateStringsArray, ...args: any[]) => {
    return (props: any) => {
      if (!props[name]) return
      return css(template, ...args)
    }
  }
}
