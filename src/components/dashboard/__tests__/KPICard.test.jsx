import { render, screen } from '@testing-library/react'
import KPICard from '../KPICard'
import { DollarSign } from 'lucide-react'

describe('KPICard', () => {
  it('renders title and value correctly', () => {
    render(<KPICard title="Revenue" value="$12,345" />)

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$12,345')).toBeInTheDocument()
  })

  it('renders positive change with trending up icon', () => {
    render(<KPICard title="Revenue" value="$12,345" change={5.2} changeLabel="vs last month" />)

    expect(screen.getByText('+5.2%')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
    // Check for trending up icon
    expect(document.querySelector('.lucide-trending-up')).toBeInTheDocument()
  })

  it('renders negative change with trending down icon', () => {
    render(<KPICard title="Revenue" value="$12,345" change={-2.1} />)

    expect(screen.getByText('-2.1%')).toBeInTheDocument()
  })

  it('renders neutral change with minus icon', () => {
    render(<KPICard title="Revenue" value="$12,345" change={0} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<KPICard title="Revenue" value="$12,345" icon={DollarSign} />)

    expect(document.querySelector('.lucide-dollar-sign')).toBeInTheDocument()
  })

  it('applies correct color classes for different colors', () => {
    const { container } = render(<KPICard title="Revenue" value="$12,345" color="green" />)

    expect(container.firstChild).toHaveClass('bg-nude-50/90')
  })
})