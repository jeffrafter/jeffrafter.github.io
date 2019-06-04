import React from 'react'
import {graphql} from 'gatsby'
import * as Three from 'three'

import {GridHelper} from '../lib/GridHelper'

import Layout from '../components/layout'
import Head from '../components/head'
import {theme} from '../styles/theme'

interface Props {
  readonly data: PageQueryData
}

export default class ThreeContainer extends React.Component<Props> {
  private mount: any
  private renderer?: Three.WebGLRenderer
  private scene?: Three.Scene
  private camera?: Three.PerspectiveCamera
  private cube?: Three.Mesh
  private frameId?: number

  private targetPositions: any
  private targetSizes: any
  private numTargets = 10
  private numInFront = 3
  private targetScale = 0.065
  private boxdepth = 7
  private screenAspect = 0
  private jumping = false
  private falling = false

  rand(max: number): number {
    return Math.round(Math.random() * max)
  }

  initTargets() {
    this.targetPositions = []
    this.targetSizes = []
    const depthStep = this.boxdepth / 2.0 / this.numTargets
    const startDepth = this.numInFront * depthStep
    for (let i = 0; i < this.numTargets; i++) {
      this.targetPositions.push(
        new Three.Vector3(
          0.7 * this.screenAspect * (this.rand(1000) / 1000.0 - 0.5),
          0.7 * (this.rand(1000) / 1000.0 - 0.5),
          startDepth - i * depthStep,
        ),
      )
      // Pull in the ones out in front of the display closer the center so they stay in frame
      if (i < this.numInFront) {
        this.targetPositions[i].x *= 0.5
        this.targetPositions[i].y *= 0.5
      }
      this.targetSizes.push(new Three.Vector3(this.targetScale, this.targetScale, this.targetScale))
    }
  }

  loadTexture() {
    let texture = new Three.TextureLoader().load('/target.png')

    return texture
  }

  componentDidMount() {
    this.start()
  }

  componentWillUnmount() {
    this.stop()
  }

  onKeyDown = (event: KeyEvent) => {
    if (!this.camera) return
    console.log(event.keyCode)
    switch (event.keyCode) {
      case 65: // a
        this.camera.position.x -= 0.1
        break
      case 83: // s
        this.camera.position.z += 0.1
        break
      case 68: // d
        this.camera.position.x += 0.1
        break
      case 87: // w
        this.camera.position.z -= 0.1
        break
      case 32: // space
        if (this.jumping || this.falling) return
        this.jumping = true
        break
    }
  }

  start() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.scene = new Three.Scene()

    this.camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.lookAt(5, 0, 0)
    //this.camera.position.z = 4

    this.renderer = new Three.WebGLRenderer({antialias: true})
    this.renderer.setClearColor(theme.colors.contrastLightest)
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    let material, geometry
    geometry = new Three.BoxGeometry(1, 1, 1)
    material = new Three.MeshBasicMaterial({color: theme.colors.accent})
    this.cube = new Three.Mesh(geometry, material)
    this.scene.add(this.cube)

    // front wall
    var gridHelper = new GridHelper(10, 10, 0x0000ff, 0x8080f0)
    gridHelper.position.y = 0
    gridHelper.position.x = 0
    gridHelper.position.z = -5
    this.scene.add(gridHelper)

    // floor
    gridHelper = new GridHelper(10, 10, 0x0000ff, 0x808080, 'x')
    gridHelper.position.y = -5
    gridHelper.position.x = 0
    this.scene.add(gridHelper)

    // left
    gridHelper = new GridHelper(10, 10, 0x0000ff, 0xf08080, 'y')
    gridHelper.position.y = 0
    gridHelper.position.x = -5
    this.scene.add(gridHelper)

    // right
    gridHelper = new GridHelper(10, 10, 0x0000ff, 0x30a060, 'y')
    gridHelper.position.y = 0
    gridHelper.position.x = 5
    this.scene.add(gridHelper)

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }
    if (!this.renderer) return
    this.mount.removeChild(this.renderer.domElement)
  }

  animate = () => {
    if (this.camera) {
      if (this.jumping) this.camera.position.y += 0.1
      if (this.falling) this.camera.position.y -= 0.1
      if (this.camera.position.y >= 3) {
        this.jumping = false
        this.falling = true
      }
      if (this.camera.position.y <= 0) {
        this.falling = false
        this.camera.position.y = 0
      }
    }
    if (this.cube) {
      this.cube.rotation.x += 0.01
      this.cube.rotation.y += 0.01
    }
    this.renderer!.render(this.scene!, this.camera!)
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  render() {
    const {data} = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout title={siteTitle}>
        <Head title="Three.js scene" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
        <article>
          <h1>three.js</h1>
          <div className={`page-content`}>
            <div
              tabindex={0}
              onKeyDown={this.onKeyDown}
              style={{width: '800px', height: '800px'}}
              ref={mount => {
                this.mount = mount
              }}
            />
          </div>
        </article>
      </Layout>
    )
  }
}

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
