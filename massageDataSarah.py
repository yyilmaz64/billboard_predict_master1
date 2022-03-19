# extract info from billboard list
def getInfo(song, SongList):
    print('into massage data')
    print(song)
    for row in SongList:
        # print('inside for loop')
        for k in row.keys():
            if row[k] == song:
                return_entry = {k: row[k] for k in row if k not in ['song']}
                # print(row)
                # print(return_entry)
                return return_entry

def makeTestPoint():
    # fill in the blank not on billboard hits 
    return 0
