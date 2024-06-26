import { Vector2 } from '../utils/utils'
import { TouchInteractionState } from './TouchInteractionState'
import { MouseInteractionState } from './MouseInteractionState'

export interface NavigatorState {
	onPointerDown(event: PointerEvent): void
	onPointerMove(event: PointerEvent): void
	onPointerUp(event: PointerEvent): void
	onWheel(event: WheelEvent): void
	enterState(): void
	exitState(): void
	setScale(value: number): void
}

export class Navigator extends EventTarget {
	private static readonly TOP_GUTTER = 8
	private static readonly STEP = 100

	public position: Vector2 = { x: 0, y: 0 }

	public scale: number = 1

	private defaultWidth: number

	private defaultHeight: number

	private state: NavigatorState | null = null

	private animationId: number = -1

	public constructor(public readonly container: HTMLDivElement, private readonly element: HTMLDivElement) {
		super()

		if (!this.container) {
			debugger
		}

		this.container.addEventListener('pointerdown', (event) => this.onPointerDown(event))
		this.container.addEventListener('pointermove', (event) => this.onPointerMove(event))
		this.container.addEventListener('pointerup', (event) => this.onPointerUp(event))

		this.container.addEventListener('wheel', (event) => this.onWheel(event))

		// this.container.addEventListener('touchstart', (event) => this.onTouchStart(event))
		this.container.addEventListener('touchmove', (event) => this.onTouchMove(event))
		// this.container.addEventListener('touchend', (event) => this.onTouchEnd(event))

		window.addEventListener('keydown', (event) => this.onKeyPress(event))

		const box = this.element.getBoundingClientRect()
		this.defaultWidth = box.width
		this.defaultHeight = box.height

		this.switchState(new MouseInteractionState(this))

		this.animate()
	}

	public destroy() {
		cancelAnimationFrame(this.animationId)
		this.state?.exitState()
	}

	public scaleToFit() {
		const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect()

		let newScale: number
		if (this.defaultWidth !== 0) {
			newScale = Math.min(
				containerWidth / this.defaultWidth,
				containerHeight / (this.defaultHeight + Navigator.TOP_GUTTER)
			)
		} else {
			newScale = 1
		}
		newScale = newScale > 1 ? 1 : newScale

		const newWidth = this.defaultWidth * newScale
		const newHeight = this.defaultHeight * newScale

		this.position = {
			x: (containerWidth - newWidth) / 2,
			y: (containerHeight - newHeight) / 2 + Navigator.TOP_GUTTER,
		}

		this.setScale(newScale)
	}

	public switchState(state: NavigatorState) {
		this.state?.exitState()
		this.state = state
		this.state.enterState()
	}

	public detectInteractionState(event: PointerEvent): void {
		if (this.isTouch(event)) {
			if (this.state instanceof TouchInteractionState) {
				return
			}
			this.switchState(new TouchInteractionState(this))
		} else {
			if (this.state instanceof MouseInteractionState) {
				return
			}
			this.switchState(new MouseInteractionState(this))
		}
	}

	private isTouch(event: PointerEvent): boolean {
		return event.pointerType === 'touch'
	}

	private setScale(scale: number) {
		this.scale = scale
		this.state?.setScale(scale)
	}

	private onPointerDown(event: PointerEvent): void {
		// event.preventDefault()

		this.detectInteractionState(event)
		this.state?.onPointerDown(event)
	}

	private onPointerMove(event: PointerEvent): void {
		event.preventDefault()
		this.state?.onPointerMove(event)
	}

	private onPointerUp(event: PointerEvent): void {
		event.preventDefault()
		this.state?.onPointerUp(event)
	}

	// private onTouchStart(event: TouchEvent) {
	// 	event.preventDefault()
	// }

	private onTouchMove(event: TouchEvent) {
		event.preventDefault()
	}

	// private onTouchEnd(event: TouchEvent) {
	// 	event.preventDefault()
	// }

	private onWheel(e: WheelEvent) {
		this.state?.onWheel(e)
	}

	private onKeyPress(event: KeyboardEvent) {
		const code = event.code
		switch (code) {
			case 'ArrowUp':
			case 'KeyW':
				this.position.y += Navigator.STEP
				break
			case 'ArrowDown':
			case 'KeyS':
				this.position.y -= Navigator.STEP
				break
			case 'ArrowLeft':
			case 'KeyA':
				this.position.x += Navigator.STEP
				break
			case 'ArrowRight':
			case 'KeyD':
				this.position.x -= Navigator.STEP
				break
		}
	}

	private animate(): void {
		this.animationId = requestAnimationFrame(() => {
			this.update()
			this.animate()
		})
	}

	public setPosition(x: number, y: number): void {
		this.position.x = x
		this.position.y = y
		this.dispatchEvent(new CustomEvent('bump'))
	}

	public update(): void {
		this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`
	}
}
