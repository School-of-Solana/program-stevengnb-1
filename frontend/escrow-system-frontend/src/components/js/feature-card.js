export default {
  name: 'FeatureCard',
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    },
    iconPath: {
      type: String,
      required: true
    },
    gradientClass: {
      type: String,
      required: true
    },
    iconBgClass: {
      type: String,
      required: true
    },
    iconColorClass: {
      type: String,
      required: true
    },
    textColorClass: {
      type: String,
      required: true
    }
  }
}
