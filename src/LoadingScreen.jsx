import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './LoadingScreen.css'

function createVoxelModel(THREE, scene) {
  const model = new THREE.Group()
  const materials = [
    new THREE.MeshStandardMaterial({ color: '#ffd500', roughness: 0.45, metalness: 0.08 }),
    new THREE.MeshStandardMaterial({ color: '#ff007f', roughness: 0.48, metalness: 0.05 }),
    new THREE.MeshStandardMaterial({ color: '#00c875', roughness: 0.48, metalness: 0.05 }),
  ]
  const outlineMaterial = new THREE.LineBasicMaterial({ color: '#171717' })

  const addBlock = (width, height, depth, material, position) => {
    const geometry = new THREE.BoxGeometry(width, height, depth)
    const block = new THREE.Mesh(geometry, material)
    block.position.set(...position)
    block.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), outlineMaterial))
    model.add(block)
  }

  addBlock(1.5, 0.38, 0.82, materials[2], [0, -0.66, 0])
  addBlock(1.08, 0.78, 0.82, materials[1], [0, -0.08, 0])
  addBlock(1.08, 0.3, 0.82, materials[0], [0, 0.46, 0])

  const studGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.16, 12)
  for (const x of [-0.34, 0, 0.34]) {
    const stud = new THREE.Mesh(studGeometry, materials[0])
    stud.position.set(x, 0.69, 0)
    stud.add(new THREE.LineSegments(new THREE.EdgesGeometry(studGeometry), outlineMaterial))
    model.add(stud)
  }

  scene.add(model)
  return { model, outlineMaterial, studGeometry, materials }
}

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef(null)

  useEffect(() => {
    const startedAt = performance.now()
    const duration = 2600
    let frame

    const updateProgress = (now) => {
      const nextProgress = Math.min(Math.round(((now - startedAt) / duration) * 100), 100)
      setProgress(nextProgress)
      if (nextProgress < 100) frame = window.requestAnimationFrame(updateProgress)
      else setIsLoading(false)
    }

    frame = window.requestAnimationFrame(updateProgress)
    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (isLoading) return undefined
    const timeout = window.setTimeout(onComplete, 220)
    return () => window.clearTimeout(timeout)
  }, [isLoading, onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let disposed = false
    let renderer
    let resizeObserver
    let animationFrame
    let model
    let sceneMaterials
    import('three').then((THREE) => {
      if (disposed) return

      try {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
        camera.position.set(0, 0.15, 4.7)
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor('#f4f1ea', 0)

        scene.add(new THREE.HemisphereLight('#ffffff', '#777060', 2.25))
        const keyLight = new THREE.DirectionalLight('#ffffff', 3.1)
        keyLight.position.set(-3, 4, 5)
        scene.add(keyLight)
        const rimLight = new THREE.DirectionalLight('#ff78b6', 1.2)
        rimLight.position.set(3, 1, -3)
        scene.add(rimLight)

        const voxel = createVoxelModel(THREE, scene)
        model = voxel.model
        sceneMaterials = [...voxel.materials, voxel.outlineMaterial]

        const resize = () => {
          const { width, height } = canvas.getBoundingClientRect()
          if (!width || !height) return
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const clock = new THREE.Clock()
          const animate = () => {
            const elapsed = clock.getElapsedTime()
            model.rotation.y = elapsed * 0.42
            model.rotation.x = Math.sin(elapsed * 0.45) * 0.08
            model.position.y = Math.sin(elapsed * 0.8) * 0.06
            renderer.render(scene, camera)
            animationFrame = window.requestAnimationFrame(animate)
          }
          animationFrame = window.requestAnimationFrame(animate)
        }
      } catch {
        canvas.dataset.webglUnavailable = 'true'
      }
    }).catch(() => {
      if (!disposed) canvas.dataset.webglUnavailable = 'true'
    })

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      model?.traverse((object) => object.geometry?.dispose())
      sceneMaterials?.forEach((material) => material.dispose())
      renderer?.dispose()
    }
  }, [])

  return (
    <motion.div
      id="loading-screen"
      className="loading-screen minimal-loader"
      role="status"
      aria-label={`Initializing portfolio ${progress}%`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 1 : 0, scale: isLoading ? 1 : 1.025 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <div className="loading-watermark" aria-hidden="true">
        <span className="loading-watermark-text">PORTFOLIO</span>
      </div>
      <motion.div className="loading-3d-stage" animate={{ y: isLoading ? 0 : -6 }} transition={{ duration: 0.24 }}>
        <canvas ref={canvasRef} className="loading-3d-canvas" aria-label="Rotating 3D voxel model" />
      </motion.div>
      <div className="loading-progress-pill" role="progressbar" aria-label="Portfolio loading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
        INITIALIZING... {progress}%
      </div>
    </motion.div>
  )
}

export default LoadingScreen
