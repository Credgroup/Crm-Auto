const renderer = ({minutes, seconds, completed }: Readonly<{ minutes: number, seconds: number, completed: boolean }>) => {
    if (completed) {
      return <span>Link expirado</span>;
    } else {
      return <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>;
    }
  }

export default renderer;