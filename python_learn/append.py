###in place
# append
my_list = [1, 2, 3]
my_list.append(4)
print(my_list) 

# extend
my_list = [1, 2, 3]
my_list.extend([4, 5])
print(my_list) 

# +=
my_list = [1, 2, 3]
my_list += [4, 5]
print(my_list) 

# insert
my_list = [1, 2, 3]
my_list.insert(len(my_list), 4)
print(my_list)  


### new list
# +
my_list = [1, 2, 3]
new_list = my_list + [4, 5]
print(new_list)  
print(my_list)   

# Unpacking
my_list = [1, 2, 3]
new_list = [*my_list, 4, 5]
print(new_list)

# list
my_list = [1, 2, 3]
new_list = list(my_list) + [4]
print(new_list) 

# copy
lst = [1, 2, 3]
# ساخت یک کپی جدید
new_list = lst.copy()
new_list.append(4)
print("Original list:", lst)  
print("New list:", new_list) 

# itertools
# itertools.chain(iterable1, iterable2, iterable3, ...)
# without lazy 
# eager
import itertools
lst = [1, 2, 3]
new_list = list(itertools.chain(lst, [4, 5]))
print("Original list:", lst) 
print("New list:", new_list) 

# Mohammadreza Vossoughi










