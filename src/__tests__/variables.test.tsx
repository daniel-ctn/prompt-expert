import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  extractVariables,
  resolveVariables,
  VariableFiller,
} from '@/components/prompt-builder/variable-filler'

describe('extractVariables', () => {
  it('extracts unique variable names', () => {
    const text = 'Hello {{name}}, welcome to {{city}}. Your name is {{name}}.'
    expect(extractVariables(text)).toEqual(['name', 'city'])
  })

  it('returns empty array for no variables', () => {
    expect(extractVariables('No variables here')).toEqual([])
  })

  it('trims whitespace inside braces', () => {
    expect(extractVariables('{{ spaced }}')).toEqual(['spaced'])
  })
})

describe('resolveVariables', () => {
  it('replaces variables with values', () => {
    const text = 'Hello {{name}}, you live in {{city}}.'
    const result = resolveVariables(text, { name: 'Alice', city: 'Paris' })
    expect(result).toBe('Hello Alice, you live in Paris.')
  })

  it('keeps unresolved variables as-is', () => {
    const result = resolveVariables('Hi {{name}}', {})
    expect(result).toBe('Hi {{name}}')
  })

  it('replaces repeated variables and trims whitespace in lookups', () => {
    const result = resolveVariables('Hi {{ name }}, {{name}} is ready.', {
      name: 'Alice',
    })

    expect(result).toBe('Hi Alice, Alice is ready.')
  })
})

describe('VariableFiller', () => {
  it('renders nothing when there are no variables', () => {
    const { container } = render(
      <VariableFiller variables={[]} values={{}} onChange={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders each variable and forwards updates', () => {
    const onChange = vi.fn()

    render(
      <VariableFiller
        variables={['name', 'city']}
        values={{ name: 'Alice' }}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('Variables')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('{{name}}')).toBeInTheDocument()
    expect(screen.getByText('{{city}}')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Enter city...'), {
      target: { value: 'Paris' },
    })

    expect(onChange).toHaveBeenCalledWith({
      name: 'Alice',
      city: 'Paris',
    })
  })
})
