import { DropIn } from '@/components/ui/DropIn'

interface GiantNameProps {
  className?: string
  lineClassName: string
  connectorClassName: string
}

/** "CARPINTERÍA / y DECORACIÓN": el nombre gigante que va detrás del mueble (es el h1 de inicio). */
export function GiantName({ className = '', lineClassName, connectorClassName }: GiantNameProps) {
  return (
    <h1 className={className}>
      <DropIn as="span" order={1} className={`block uppercase ${lineClassName}`}>
        Carpintería
      </DropIn>
      <DropIn as="span" order={2} className={`block uppercase ${lineClassName}`}>
        <span className={`normal-case ${connectorClassName}`}>y</span> Decoración
      </DropIn>
    </h1>
  )
}
