import { useOverlay } from '@overlays/react'
import { Modal } from 'antd'

function TransferToModal() {
  const { resolve, visible, reject } = useOverlay({
    duration: 1000
  })
  return <Modal open={visible} onCancel={() => reject()} footer={false}>
    <input />
  </Modal>
}

export default TransferToModal