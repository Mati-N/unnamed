def changeTime(time):
    time = time.split(":")
    first = time[0].split(",")
    timetemp = first + time[1:len(time)]
    time = timetemp
    for i in range(len(time)):
        time[i] = time[i].strip(" ")

    changed = ""
    if len(time) == 3:
        if not int(time[0]) < 1:
            if int(time[0]) == 1:
                changed += "1 hour "
            else:
                changed += time[0] + " hours "
        if not int(time[1]) < 1:
            if int(time[1]) == 1:
                changed += "1 minute"
            else:
                changed += time[1] + " minutes"
    elif len(time) == 4:
        if int(time[0].strip(" days")) > 365:
            changed += str(round(int(time[0].strip(" days"))/365.25)) + " years"
        elif int(time[0].strip(" days")) >= 30:
            changed += str(round(int(time[0].strip(" days"))/30)) + " months"
        else:
            changed += time[0] + " "
            if not int(time[1]) < 1:
                if int(time[1]) == 1:
                    changed += "1 hour"
                else:
                    changed += time[1] + " hours "

    if changed == "":
        changed = "Seconds"

    return changed