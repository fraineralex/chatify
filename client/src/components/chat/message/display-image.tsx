import { useSocketStore } from '../../../store/socket'
import { MESSAGES_TYPES } from '../../../constants'
import { useImageSliderStore } from '../../../store/imageSlider'

export default function DisplayImage ({
  chatId,
  imageUrl
}: {
  chatId: string
  imageUrl: string
}) {
  const { setIndex, setVisible } = useImageSliderStore()
  const chatImageMessages = useSocketStore(state => state.messages)
    .filter(
      c => c.chatId === chatId && c.type === MESSAGES_TYPES.IMAGE && !!c.file
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(message => message.file?.url ?? '')
    .filter(Boolean)

  const handleImageClick = () => {
    setVisible(true)
    setIndex(chatImageMessages.indexOf(imageUrl) || 0)
  }
  return (
    <img
      src={imageUrl}
      alt='Image of the message'
      className='max-w-80 max-h-[640px] w-auto h-auto rounded-lg'
      onClick={handleImageClick}
    />
  )
}
